package cz.astip.serviszdroju.offline;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import cz.astip.serviszdroju.BuildConfig;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public final class SzzSyncWorker extends Worker {
    private static final String IDENTITY_TOOLKIT_URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=" + BuildConfig.FIREBASE_WEB_API_KEY;
    private static final String FIRESTORE_ROOT =
        "https://firestore.googleapis.com/v1/projects/" + BuildConfig.FIREBASE_PROJECT_ID + "/databases/(default)/documents";
    private static final String CLOUDINARY_UPLOAD_URL =
        "https://api.cloudinary.com/v1_1/" + BuildConfig.CLOUDINARY_CLOUD_NAME + "/image/upload";

    public SzzSyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context context = getApplicationContext();
        SzzOfflineDao dao = SzzOfflineDatabase.get(context).dao();
        long now = System.currentTimeMillis();
        List<OfflineEntities.SyncOutboxEntity> pending = dao.pendingOutbox(now, 25);
        if (pending == null || pending.isEmpty()) return Result.success();

        String googleIdToken = trim(SzzAndroidAuthStore.googleIdToken(context));
        if (googleIdToken.isEmpty()) {
            markAllWaitingForLogin(dao, pending, "Čeká na Android přihlášení technika.");
            return Result.success();
        }

        FirebaseSession session;
        try {
            session = exchangeGoogleToken(googleIdToken);
        } catch (AuthException error) {
            SzzAndroidAuthStore.clear(context);
            markAllWaitingForLogin(dao, pending, error.getMessage());
            return Result.success();
        } catch (RetryableException error) {
            for (OfflineEntities.SyncOutboxEntity operation : pending) {
                markRetry(dao, operation, error.getMessage());
            }
            return Result.retry();
        } catch (Exception error) {
            for (OfflineEntities.SyncOutboxEntity operation : pending) {
                markRetry(dao, operation, compact(error));
            }
            return Result.retry();
        }

        boolean retryNeeded = false;
        for (OfflineEntities.SyncOutboxEntity operation : pending) {
            try {
                String opName = trim(operation.operation);
                if (SyncOperation.UPLOAD_PHOTO.name().equals(opName)) {
                    syncPhoto(dao, operation, session);
                } else if (SyncOperation.UPLOAD_ATTACHMENT.name().equals(opName)) {
                    syncAttachment(dao, operation, session);
                } else {
                    deferUnsupported(dao, operation);
                }
            } catch (AuthException error) {
                SzzAndroidAuthStore.clear(context);
                markWaitingForLogin(dao, operation, error.getMessage());
            } catch (RetryableException error) {
                retryNeeded = true;
                markRetry(dao, operation, error.getMessage());
            } catch (Exception error) {
                markFailed(dao, operation, compact(error));
            }
        }
        return retryNeeded ? Result.retry() : Result.success();
    }

    private static void syncPhoto(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation, FirebaseSession session) throws Exception {
        JSONObject payload = payload(operation);
        String childId = entityId(operation, payload, "photoId");
        String siteDocId = siteDocId(payload);
        if (childId.isEmpty()) throw new PermanentException("Fotografie nemá lokální identifikátor.");
        if (siteDocId.isEmpty()) throw new PermanentException("Fotografie nemá Firebase bod.");

        String folderName = photoFolderName(payload);
        String dataUrl = firstText(payload, "dataUrl", "fullUrl", "displayUrl", "url");
        String fullUrl = firstText(payload, "fullUrl", "url", "displayUrl");
        JSONObject cloudinary = null;
        if (startsWith(dataUrl, "data:")) {
            cloudinary = uploadCloudinary(dataUrl, folderName);
            fullUrl = trim(cloudinary.optString("fullUrl"));
        } else if (!fullUrl.contains("/image/upload/")) {
            throw new PermanentException("Fotografie nemá lokální data ani Cloudinary URL.");
        }

        String syncedAt = isoNow();
        if (cloudinary != null) {
            payload.put("url", cloudinary.optString("url"));
            payload.put("displayUrl", cloudinary.optString("displayUrl"));
            payload.put("thumbUrl", cloudinary.optString("thumbUrl"));
            payload.put("fullUrl", cloudinary.optString("fullUrl"));
            payload.remove("dataUrl");
            payload.put("storagePath", cloudinary.optString("storagePath"));
            payload.put("cloudinaryFolder", cloudinary.optString("cloudinaryFolder"));
            payload.put("cloudinaryPublicId", cloudinary.optString("cloudinaryPublicId"));
            payload.put("cloudinaryAssetId", cloudinary.optString("cloudinaryAssetId"));
            payload.put("cloudinaryVersion", cloudinary.optString("cloudinaryVersion"));
            payload.put("cloudinaryUploadPreset", cloudinary.optString("cloudinaryUploadPreset"));
        }
        payload.put("_id", childId);
        payload.put("storageMode", "cloudinary");
        payload.put("_offline", false);
        payload.put("_syncStatus", "online");
        payload.put("localOnly", false);
        payload.put("offlineReason", "");
        payload.put("syncedAt", syncedAt);
        payload.put("syncedBy", session.email);
        putIfMissing(payload, "uploadedBy", session.email);
        putIfMissing(payload, "photoFolder", folderName);
        putIfMissing(payload, "folderName", folderName);
        putIfMissing(payload, "folder", folderName);
        putIfMissing(payload, "cloudinaryFolderDate", folderName);
        if (cloudinary != null) {
            dao.updateOutboxPayload(operation.operationId, payload.toString(), syncedAt);
            dao.updatePhotoSyncState(operation.entityLocalId, SyncState.PENDING.name(), fullUrl, payload.toString(), syncedAt, "Cloudinary hotovo, čeká zápis do Firebase.");
        }

        writeChild("photos", siteDocId, childId, payload, session.firebaseIdToken);
        touchParent(siteDocId, syncedAt, session.firebaseIdToken);
        dao.updatePhotoSyncState(operation.entityLocalId, SyncState.SYNCED.name(), fullUrl, payload.toString(), syncedAt, null);
        dao.markOutboxSynced(operation.operationId, syncedAt);
    }

    private static void syncAttachment(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation, FirebaseSession session) throws Exception {
        JSONObject payload = payload(operation);
        String childId = entityId(operation, payload, "attachmentId");
        String siteDocId = siteDocId(payload);
        if (childId.isEmpty()) throw new PermanentException("Příloha nemá lokální identifikátor.");
        if (siteDocId.isEmpty()) throw new PermanentException("Příloha nemá Firebase bod.");

        String syncedAt = isoNow();
        payload.put("_id", childId);
        payload.put("_offline", false);
        payload.put("_syncStatus", "online");
        payload.put("localOnly", false);
        payload.put("syncedAt", syncedAt);
        payload.put("syncedBy", session.email);
        putIfMissing(payload, "uploadedBy", session.email);

        writeChild("attachments", siteDocId, childId, payload, session.firebaseIdToken);
        touchParent(siteDocId, syncedAt, session.firebaseIdToken);
        dao.updateAttachmentSyncState(operation.entityLocalId, SyncState.SYNCED.name(), firstText(payload, "downloadUrl", "remoteUrl", "url", "dataUrl"), payload.toString(), syncedAt, null);
        dao.markOutboxSynced(operation.operationId, syncedAt);
    }

    private static FirebaseSession exchangeGoogleToken(String googleIdToken) throws Exception {
        JSONObject body = new JSONObject();
        body.put("postBody", "id_token=" + urlEncode(googleIdToken) + "&providerId=google.com");
        body.put("requestUri", BuildConfig.WEB_ORIGIN + "/Mapa/");
        body.put("returnIdpCredential", true);
        body.put("returnSecureToken", true);
        HttpResult result = postJson(IDENTITY_TOOLKIT_URL, body, null);
        if (result.status == 429 || result.status >= 500) throw new RetryableException("Firebase přihlášení je dočasně nedostupné (" + result.status + ").");
        if (result.status < 200 || result.status >= 300) throw new AuthException(firebaseError(result, "Firebase odmítl Android přihlášení."));
        JSONObject parsed = new JSONObject(result.body == null ? "{}" : result.body);
        String token = trim(parsed.optString("idToken"));
        String email = trim(parsed.optString("email")).toLowerCase(Locale.ROOT);
        if (token.isEmpty()) throw new AuthException("Firebase nevrátil přihlašovací token.");
        if (!email.endsWith("@astip.cz")) throw new AuthException("Přihlášení je povolené jen pro účet @astip.cz.");
        return new FirebaseSession(token, email);
    }

    private static JSONObject uploadCloudinary(String dataUrl, String folderName) throws Exception {
        JSONObject form = new JSONObject();
        form.put("file", dataUrl);
        form.put("upload_preset", BuildConfig.CLOUDINARY_UPLOAD_PRESET);
        String folderPath = cloudinaryFolderPath(folderName);
        if (!folderPath.isEmpty()) form.put("folder", folderPath);
        HttpResult result = postMultipart(CLOUDINARY_UPLOAD_URL, form);
        if (result.status == 429 || result.status >= 500) throw new RetryableException("Cloudinary je dočasně nedostupné (" + result.status + ").");
        if (result.status < 200 || result.status >= 300) throw new PermanentException(cloudinaryError(result));
        JSONObject data = new JSONObject(result.body == null ? "{}" : result.body);
        String fullUrl = trim(data.optString("secure_url"));
        if (fullUrl.isEmpty()) throw new PermanentException("Cloudinary nevrátilo URL fotografie.");
        JSONObject out = new JSONObject();
        out.put("url", cloudinaryTransformUrl(fullUrl, "f_auto,q_auto,w_1600,c_limit"));
        out.put("displayUrl", cloudinaryTransformUrl(fullUrl, "f_auto,q_auto,w_1600,c_limit"));
        out.put("thumbUrl", cloudinaryTransformUrl(fullUrl, "f_auto,q_auto,w_240,c_limit"));
        out.put("fullUrl", fullUrl);
        out.put("storagePath", folderPath);
        out.put("cloudinaryFolder", folderPath);
        out.put("cloudinaryPublicId", data.optString("public_id", ""));
        out.put("cloudinaryAssetId", data.optString("asset_id", ""));
        out.put("cloudinaryVersion", data.optString("version", ""));
        out.put("cloudinaryUploadPreset", BuildConfig.CLOUDINARY_UPLOAD_PRESET);
        return out;
    }

    private static void writeChild(String collection, String siteDocId, String childId, JSONObject payload, String firebaseIdToken) throws Exception {
        String url = FIRESTORE_ROOT + "/sitesUnified/" + path(siteDocId) + "/" + path(collection) + "/" + path(childId);
        HttpResult result = patchJson(url, firestoreDocument(payload), firebaseIdToken);
        if (result.status == 401 || result.status == 403) throw new AuthException("Firebase nepovolil uložit změnu. Přihlas se v aplikaci znovu.");
        if (result.status == 429 || result.status >= 500) throw new RetryableException("Firebase uložení je dočasně nedostupné (" + result.status + ").");
        if (result.status < 200 || result.status >= 300) throw new PermanentException(firebaseError(result, "Firebase nepovolil uložit záznam."));
    }

    private static void touchParent(String siteDocId, String updatedAt, String firebaseIdToken) throws Exception {
        JSONObject data = new JSONObject();
        data.put("updatedAt", updatedAt);
        String url = FIRESTORE_ROOT + "/sitesUnified/" + path(siteDocId)
            + "?updateMask.fieldPaths=updatedAt&currentDocument.exists=true";
        HttpResult result = patchJson(url, firestoreDocument(data), firebaseIdToken);
        if (result.status == 401 || result.status == 403) throw new AuthException("Firebase relace vypršela. Přihlas se v aplikaci znovu.");
        if (result.status == 429 || result.status >= 500) throw new RetryableException("Firebase potvrzení synchronizace je dočasně nedostupné (" + result.status + ").");
    }

    private static JSONObject firestoreDocument(JSONObject data) throws JSONException {
        JSONObject document = new JSONObject();
        document.put("fields", firestoreFields(data));
        return document;
    }

    private static JSONObject firestoreFields(JSONObject data) throws JSONException {
        JSONObject fields = new JSONObject();
        Iterator<String> keys = data.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            fields.put(key, firestoreValue(data.opt(key)));
        }
        return fields;
    }

    private static JSONObject firestoreValue(Object value) throws JSONException {
        JSONObject out = new JSONObject();
        if (value == null || value == JSONObject.NULL) {
            out.put("nullValue", JSONObject.NULL);
        } else if (value instanceof Boolean) {
            out.put("booleanValue", value);
        } else if (value instanceof Integer || value instanceof Long) {
            out.put("integerValue", String.valueOf(value));
        } else if (value instanceof Number) {
            double number = ((Number) value).doubleValue();
            if (Double.isNaN(number) || Double.isInfinite(number)) out.put("nullValue", JSONObject.NULL);
            else out.put("doubleValue", number);
        } else if (value instanceof JSONObject) {
            JSONObject mapValue = new JSONObject();
            mapValue.put("fields", firestoreFields((JSONObject) value));
            out.put("mapValue", mapValue);
        } else if (value instanceof JSONArray) {
            JSONArray array = (JSONArray) value;
            JSONObject arrayValue = new JSONObject();
            if (array.length() > 0) {
                JSONArray values = new JSONArray();
                for (int i = 0; i < array.length(); i++) values.put(firestoreValue(array.opt(i)));
                arrayValue.put("values", values);
            }
            out.put("arrayValue", arrayValue);
        } else {
            out.put("stringValue", String.valueOf(value));
        }
        return out;
    }

    private static HttpResult postJson(String url, JSONObject body, @Nullable String bearer) throws IOException {
        return sendJson("POST", url, body, bearer, false);
    }

    private static HttpResult patchJson(String url, JSONObject body, String bearer) throws IOException {
        return sendJson("POST", url, body, bearer, true);
    }

    private static HttpResult sendJson(String method, String url, JSONObject body, @Nullable String bearer, boolean patchOverride) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setConnectTimeout(20_000);
        connection.setReadTimeout(35_000);
        connection.setRequestMethod(method);
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
        if (patchOverride) connection.setRequestProperty("X-HTTP-Method-Override", "PATCH");
        if (bearer != null && !bearer.trim().isEmpty()) connection.setRequestProperty("Authorization", "Bearer " + bearer.trim());
        connection.setDoOutput(true);
        byte[] bytes = body.toString().getBytes(StandardCharsets.UTF_8);
        connection.setFixedLengthStreamingMode(bytes.length);
        try (OutputStream stream = connection.getOutputStream()) {
            stream.write(bytes);
        }
        return readHttp(connection);
    }

    private static HttpResult postMultipart(String url, JSONObject fields) throws IOException {
        String boundary = "----SzzBoundary" + System.currentTimeMillis();
        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setConnectTimeout(25_000);
        connection.setReadTimeout(90_000);
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
        connection.setDoOutput(true);
        try (DataOutputStream stream = new DataOutputStream(connection.getOutputStream())) {
            Iterator<String> keys = fields.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                String value = String.valueOf(fields.opt(key));
                stream.writeBytes("--" + boundary + "\r\n");
                stream.writeBytes("Content-Disposition: form-data; name=\"" + key.replace("\"", "") + "\"\r\n\r\n");
                stream.write(value.getBytes(StandardCharsets.UTF_8));
                stream.writeBytes("\r\n");
            }
            stream.writeBytes("--" + boundary + "--\r\n");
            stream.flush();
        }
        return readHttp(connection);
    }

    private static HttpResult readHttp(HttpURLConnection connection) throws IOException {
        int status = connection.getResponseCode();
        InputStream stream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        String body = readString(stream);
        connection.disconnect();
        return new HttpResult(status, body);
    }

    private static String readString(@Nullable InputStream stream) throws IOException {
        if (stream == null) return "";
        StringBuilder out = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) out.append(line);
        }
        return out.toString();
    }

    private static JSONObject payload(OfflineEntities.SyncOutboxEntity operation) throws JSONException {
        String raw = trim(operation.payloadJson);
        JSONObject payload = raw.isEmpty() ? new JSONObject() : new JSONObject(raw);
        String nested = trim(payload.optString("payloadJson"));
        if (!nested.isEmpty()) payload = new JSONObject(nested);
        return payload;
    }

    private static String entityId(OfflineEntities.SyncOutboxEntity operation, JSONObject payload, String typeIdKey) {
        String value = firstText(payload, "_id", "id", typeIdKey, "firebaseId", "firebaseDocId");
        if (value.isEmpty()) value = trim(operation.entityLocalId);
        return value;
    }

    private static String siteDocId(JSONObject payload) {
        String direct = firstText(payload, "siteDocId", "firebaseDocId", "siteFirebaseId", "Firebase_doc_id", "siteId", "siteKey", "siteLocalId");
        if (!direct.isEmpty()) return direct;
        JSONArray keys = payload.optJSONArray("siteKeys");
        if (keys != null) {
            for (int i = 0; i < keys.length(); i++) {
                String key = trim(keys.optString(i, ""));
                if (!key.isEmpty()) return key;
            }
        }
        return "";
    }

    private static String firstText(JSONObject object, String... keys) {
        if (object == null || keys == null) return "";
        for (String key : keys) {
            String value = trim(object.optString(key, ""));
            if (!value.isEmpty() && !"null".equalsIgnoreCase(value)) return value;
        }
        return "";
    }

    private static String photoFolderName(JSONObject payload) {
        String direct = firstText(payload, "photoFolder", "folderName", "folder", "cloudinaryFolderDate");
        if (!direct.isEmpty()) return direct;
        String date = firstText(payload, "createdAt", "takenAt", "addedAt", "savedAt", "syncQueuedAt");
        if (date.length() >= 10) return date.substring(0, 10);
        return isoNow().substring(0, 10);
    }

    private static String cloudinaryFolderPath(String folderName) {
        String base = trim(BuildConfig.CLOUDINARY_FOLDER);
        String folder = trim(folderName);
        if (base.isEmpty()) return folder;
        if (folder.isEmpty()) return base;
        return base + "/" + folder;
    }

    private static String cloudinaryTransformUrl(String url, String transformation) {
        String source = trim(url);
        String transform = trim(transformation);
        String marker = "/image/upload/";
        int markerIndex = source.indexOf(marker);
        if (source.isEmpty() || transform.isEmpty() || markerIndex < 0) return source;
        if (source.contains(marker + transform + "/")) return source;
        String prefix = source.substring(0, markerIndex + marker.length());
        String rest = source.substring(markerIndex + marker.length());
        int slashIndex = rest.indexOf("/");
        if (slashIndex < 0) return source;
        String firstSegment = rest.substring(0, slashIndex);
        String remaining = rest.substring(slashIndex + 1);
        boolean firstIsVersion = firstSegment.matches("(?i)^v\\d+$");
        boolean firstLooksTransform = firstSegment.matches("(?i).*(^|,)(f_auto|q_auto|w_\\d+|h_\\d+|c_[a-z0-9_]+|dpr_|fl_|e_|g_|r_|ar_).*");
        return firstLooksTransform && !firstIsVersion
            ? prefix + transform + "/" + remaining
            : prefix + transform + "/" + rest;
    }

    private static void putIfMissing(JSONObject object, String key, String value) throws JSONException {
        if (object == null || key == null || value == null || value.trim().isEmpty()) return;
        if (!object.has(key) || object.isNull(key) || trim(object.optString(key)).isEmpty()) object.put(key, value);
    }

    private static void deferUnsupported(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation) {
        dao.updateOutboxState(
            operation.operationId,
            SyncState.PENDING.name(),
            operation.attemptCount,
            System.currentTimeMillis() + 30L * 60L * 1000L,
            isoNow(),
            "Tuto změnu zatím odesílá webová část aplikace po přihlášení."
        );
    }

    private static void markAllWaitingForLogin(SzzOfflineDao dao, List<OfflineEntities.SyncOutboxEntity> pending, String message) {
        for (OfflineEntities.SyncOutboxEntity operation : pending) markWaitingForLogin(dao, operation, message);
    }

    private static void markWaitingForLogin(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation, String message) {
        dao.updateOutboxState(
            operation.operationId,
            SyncState.PENDING.name(),
            operation.attemptCount,
            System.currentTimeMillis() + 10L * 60L * 1000L,
            isoNow(),
            trim(message).isEmpty() ? "Čeká na nové přihlášení technika." : message
        );
    }

    private static void markRetry(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation, String message) {
        int attempt = Math.max(0, operation.attemptCount) + 1;
        long delay = Math.min(6L * 60L * 60L * 1000L, 60_000L * (1L << Math.min(attempt, 6)));
        dao.updateOutboxState(
            operation.operationId,
            SyncState.PENDING.name(),
            attempt,
            System.currentTimeMillis() + delay,
            isoNow(),
            trim(message).isEmpty() ? "Synchronizaci teď nejde dokončit." : message
        );
    }

    private static void markFailed(SzzOfflineDao dao, OfflineEntities.SyncOutboxEntity operation, String message) {
        String updatedAt = isoNow();
        String compact = trim(message).isEmpty() ? "Synchronizace selhala." : message;
        dao.updateOutboxState(operation.operationId, SyncState.FAILED.name(), Math.max(0, operation.attemptCount) + 1, 0L, updatedAt, compact);
        if (OfflineTables.PHOTOS.equals(operation.entityTable)) {
            dao.updatePhotoSyncState(operation.entityLocalId, SyncState.FAILED.name(), "", operation.payloadJson, updatedAt, compact);
        } else if (OfflineTables.ATTACHMENTS.equals(operation.entityTable)) {
            dao.updateAttachmentSyncState(operation.entityLocalId, SyncState.FAILED.name(), "", operation.payloadJson, updatedAt, compact);
        }
    }

    private static String firebaseError(HttpResult result, String fallback) {
        try {
            JSONObject parsed = new JSONObject(result.body == null ? "{}" : result.body);
            String message = parsed.optJSONObject("error") == null ? "" : parsed.optJSONObject("error").optString("message");
            if (!trim(message).isEmpty()) return message;
        } catch (Exception ignored) {}
        return fallback + " (" + result.status + ")";
    }

    private static String cloudinaryError(HttpResult result) {
        try {
            JSONObject parsed = new JSONObject(result.body == null ? "{}" : result.body);
            String message = parsed.optJSONObject("error") == null ? "" : parsed.optJSONObject("error").optString("message");
            if (!trim(message).isEmpty()) return "Cloudinary odmítlo nahrání: " + message;
        } catch (Exception ignored) {}
        return "Cloudinary odmítlo nahrání (" + result.status + ").";
    }

    private static String path(String value) {
        return urlEncode(value).replace("+", "%20");
    }

    private static String urlEncode(String value) {
        try {
            return URLEncoder.encode(trim(value), "UTF-8");
        } catch (Exception ignored) {
            return trim(value);
        }
    }

    private static boolean startsWith(String value, String prefix) {
        return trim(value).startsWith(prefix);
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static String compact(Exception error) {
        if (error == null) return "";
        String message = trim(error.getMessage());
        return message.isEmpty() ? error.getClass().getSimpleName() : message;
    }

    private static String isoNow() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date());
    }

    private static final class HttpResult {
        final int status;
        final String body;

        HttpResult(int status, String body) {
            this.status = status;
            this.body = body == null ? "" : body;
        }
    }

    private static final class FirebaseSession {
        final String firebaseIdToken;
        final String email;

        FirebaseSession(String firebaseIdToken, String email) {
            this.firebaseIdToken = firebaseIdToken;
            this.email = email == null ? "" : email;
        }
    }

    private static final class AuthException extends Exception {
        AuthException(String message) {
            super(message);
        }
    }

    private static final class RetryableException extends Exception {
        RetryableException(String message) {
            super(message);
        }
    }

    private static final class PermanentException extends Exception {
        PermanentException(String message) {
            super(message);
        }
    }
}
