package cz.astip.serviszdroju.offline;

import android.content.Context;

import androidx.annotation.Nullable;
import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public final class SzzOfflineRepository {
    public interface Callback {
        void onSuccess(@Nullable JSONObject result);
        void onError(Exception error);
    }

    private static volatile SzzOfflineRepository instance;

    private final Context context;
    private final SzzOfflineDatabase database;
    private final SzzOfflineDao dao;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private SzzOfflineRepository(Context context) {
        this.context = context.getApplicationContext();
        this.database = SzzOfflineDatabase.get(context);
        this.dao = database.dao();
    }

    public static SzzOfflineRepository get(Context context) {
        if (instance != null) return instance;
        synchronized (SzzOfflineRepository.class) {
            if (instance == null) instance = new SzzOfflineRepository(context);
            return instance;
        }
    }

    public void saveProtocolDraft(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            OfflineEntities.ProtocolDraftEntity draft = new OfflineEntities.ProtocolDraftEntity();
            draft.draftId = required(payload, "draftId", "draft-" + UUID.randomUUID());
            draft.siteLocalId = optional(payload, "siteLocalId");
            draft.sourceLocalId = optional(payload, "sourceLocalId");
            draft.savedAt = optional(payload, "savedAt");
            draft.payloadJson = payload.optString("payloadJson", payloadJson);
            dao.upsertProtocolDraft(draft);
            return countsJson();
        });
    }

    public void deleteProtocolDraft(String draftId, Callback callback) {
        run(callback, () -> {
            dao.deleteProtocolDraft(draftId);
            return countsJson();
        });
    }

    public void saveLocalProtocol(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            String now = isoNow();
            OfflineEntities.ProtocolEntity protocol = new OfflineEntities.ProtocolEntity();
            protocol.localId = required(payload, "localId", "protocol-" + UUID.randomUUID());
            protocol.sourceLocalId = optional(payload, "sourceLocalId");
            protocol.firebaseId = optional(payload, "firebaseId");
            protocol.controlDate = optional(payload, "controlDate");
            protocol.savedAt = required(payload, "savedAt", now);
            protocol.technicianEmail = optional(payload, "technicianEmail");
            protocol.clientSignaturePath = optional(payload, "clientSignaturePath");
            protocol.wordExportPath = optional(payload, "wordExportPath");
            protocol.createdAt = required(payload, "createdAt", now);
            protocol.updatedAt = now;
            protocol.syncState = SyncState.PENDING.name();
            protocol.rawJson = payload.optString("payloadJson", payloadJson);

            OfflineEntities.SyncOutboxEntity operation = outboxOperation(
                payload.optString("operationId", "protocol-" + protocol.localId),
                OfflineTables.PROTOCOLS,
                protocol.localId,
                SyncOperation.UPSERT_PROTOCOL.name(),
                protocol.rawJson,
                now
            );
            database.runInTransaction(() -> {
                dao.upsertProtocol(protocol);
                dao.enqueueSyncOperation(operation);
            });
            enqueueSyncWork();
            return countsJson();
        });
    }

    public void saveSitesSnapshot(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            JSONArray items = payload.optJSONArray("items");
            if (items == null) items = payload.optJSONArray("rows");
            String now = isoNow();
            List<OfflineEntities.SiteEntity> sites = new ArrayList<>();
            if (items != null) {
                for (int i = 0; i < items.length(); i++) {
                    JSONObject item = items.optJSONObject(i);
                    OfflineEntities.SiteEntity site = siteEntityFromCacheItem(item, now);
                    if (site != null) sites.add(site);
                }
            }
            if (!sites.isEmpty()) {
                database.runInTransaction(() -> dao.upsertSites(sites));
            }
            return countsJson();
        });
    }

    public void savePhotosSnapshot(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            JSONArray items = payload.optJSONArray("items");
            String sourceLocalId = optional(payload, "sourceLocalId");
            String now = isoNow();
            List<OfflineEntities.PhotoEntity> photos = new ArrayList<>();
            if (items != null) {
                for (int i = 0; i < items.length(); i++) {
                    OfflineEntities.PhotoEntity photo = photoEntityFromPayload(items.optJSONObject(i), sourceLocalId, now, false);
                    if (photo != null) photos.add(photo);
                }
            }
            if (!photos.isEmpty()) {
                database.runInTransaction(() -> dao.upsertPhotos(photos));
            }
            return countsJson();
        });
    }

    public void saveLocalPhoto(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            String now = isoNow();
            OfflineEntities.PhotoEntity photo = photoEntityFromPayload(payload, optional(payload, "sourceLocalId"), now, true);
            if (photo == null) throw new JSONException("Fotografii nejde ulozit bez localId.");
            OfflineEntities.SyncOutboxEntity operation = outboxOperation(
                payload.optString("operationId", "photo-" + photo.localId),
                OfflineTables.PHOTOS,
                photo.localId,
                SyncOperation.UPLOAD_PHOTO.name(),
                photo.rawJson,
                now
            );
            database.runInTransaction(() -> {
                dao.upsertPhoto(photo);
                dao.enqueueSyncOperation(operation);
            });
            enqueueSyncWork();
            return countsJson();
        });
    }

    public void saveAttachmentsSnapshot(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            JSONArray items = payload.optJSONArray("items");
            String sourceLocalId = optional(payload, "sourceLocalId");
            String now = isoNow();
            List<OfflineEntities.AttachmentEntity> attachments = new ArrayList<>();
            if (items != null) {
                for (int i = 0; i < items.length(); i++) {
                    OfflineEntities.AttachmentEntity attachment = attachmentEntityFromPayload(items.optJSONObject(i), sourceLocalId, now, false);
                    if (attachment != null) attachments.add(attachment);
                }
            }
            if (!attachments.isEmpty()) {
                database.runInTransaction(() -> dao.upsertAttachments(attachments));
            }
            return countsJson();
        });
    }

    public void saveLocalAttachment(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            String now = isoNow();
            OfflineEntities.AttachmentEntity attachment = attachmentEntityFromPayload(payload, optional(payload, "sourceLocalId"), now, true);
            if (attachment == null) throw new JSONException("Prilohu nejde ulozit bez localId.");
            OfflineEntities.SyncOutboxEntity operation = outboxOperation(
                payload.optString("operationId", "attachment-" + attachment.localId),
                OfflineTables.ATTACHMENTS,
                attachment.localId,
                SyncOperation.UPLOAD_ATTACHMENT.name(),
                attachment.rawJson,
                now
            );
            database.runInTransaction(() -> {
                dao.upsertAttachment(attachment);
                dao.enqueueSyncOperation(operation);
            });
            enqueueSyncWork();
            return countsJson();
        });
    }

    public void enqueueOutbox(String payloadJson, Callback callback) {
        run(callback, () -> {
            JSONObject payload = new JSONObject(payloadJson == null ? "{}" : payloadJson);
            String now = isoNow();
            OfflineEntities.SyncOutboxEntity operation = outboxOperation(
                required(payload, "operationId", "op-" + UUID.randomUUID()),
                required(payload, "entityTable", OfflineTables.SYNC_OUTBOX),
                required(payload, "entityLocalId", ""),
                required(payload, "operation", "UPSERT"),
                payload.optString("payloadJson", payloadJson),
                now
            );
            dao.enqueueSyncOperation(operation);
            enqueueSyncWork();
            return countsJson();
        });
    }

    public void markOutboxSynced(String operationId, Callback callback) {
        run(callback, () -> {
            dao.markOutboxSynced(operationId, isoNow());
            return countsJson();
        });
    }

    public void counts(Callback callback) {
        run(callback, this::countsJson);
    }

    public String cachedSitesJson(int limit) {
        return cachedRowsJson("cachedSites", dao.cachedSiteCount(), dao.cachedSiteRawJson(cappedLimit(limit)));
    }

    public String cachedPhotosJson(int limit) {
        return cachedRowsJson("cachedPhotos", dao.cachedPhotoCount(), dao.cachedPhotoRawJson(cappedLimit(limit)));
    }

    public String cachedAttachmentsJson(int limit) {
        return cachedRowsJson("cachedAttachments", dao.cachedAttachmentCount(), dao.cachedAttachmentRawJson(cappedLimit(limit)));
    }

    public String countsJsonString() {
        try {
            JSONObject result = countsJson();
            result.put("ok", true);
            return result.toString();
        } catch (Exception error) {
            return errorJson(error);
        }
    }

    public String outboxJson(int limit) {
        JSONObject result = new JSONObject();
        try {
            List<OfflineEntities.SyncOutboxEntity> rows = dao.outboxRows(cappedLimit(limit));
            JSONArray items = new JSONArray();
            for (OfflineEntities.SyncOutboxEntity row : rows) {
                items.put(outboxRowJson(row));
            }
            result.put("ok", true);
            result.put("count", items.length());
            result.put("pendingOutbox", dao.pendingOutboxCount());
            result.put("items", items);
        } catch (Exception error) {
            try {
                result.put("ok", false);
                result.put("error", compact(error));
            } catch (Exception ignored) {}
        }
        return result.toString();
    }

    public String outboxOperationJson(String operationId) {
        JSONObject result = new JSONObject();
        try {
            OfflineEntities.SyncOutboxEntity row = dao.outboxOperation(operationId == null ? "" : operationId.trim());
            result.put("ok", true);
            result.put("found", row != null);
            if (row != null) result.put("item", outboxRowJson(row));
        } catch (Exception error) {
            try {
                result.put("ok", false);
                result.put("error", compact(error));
            } catch (Exception ignored) {}
        }
        return result.toString();
    }

    private static JSONObject outboxRowJson(OfflineEntities.SyncOutboxEntity row) throws JSONException {
        JSONObject item = new JSONObject();
        item.put("operationId", row.operationId);
        item.put("entityTable", row.entityTable);
        item.put("entityLocalId", row.entityLocalId);
        item.put("operation", row.operation);
        item.put("attemptCount", row.attemptCount);
        item.put("nextRetryAt", row.nextRetryAt);
        item.put("createdAt", row.createdAt);
        item.put("updatedAt", row.updatedAt);
        item.put("status", row.status);
        item.put("lastError", row.lastError);
        return item;
    }

    private String cachedRowsJson(String countKey, int totalCount, List<String> rows) {
        JSONObject result = new JSONObject();
        try {
            JSONArray items = new JSONArray();
            for (String row : rows) {
                try {
                    items.put(new JSONObject(row == null ? "{}" : row));
                } catch (Exception ignored) {}
            }
            result.put("ok", true);
            result.put("count", items.length());
            result.put(countKey, totalCount);
            result.put("items", items);
        } catch (Exception error) {
            try {
                result.put("ok", false);
                result.put("error", compact(error));
            } catch (Exception ignored) {}
        }
        return result.toString();
    }

    private static int cappedLimit(int limit) {
        return Math.max(1, Math.min(limit <= 0 ? 5000 : limit, 20000));
    }

    public SzzOfflineDao dao() {
        return dao;
    }

    public void enqueueSyncWork() {
        Constraints constraints = new Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build();
        OneTimeWorkRequest request = new OneTimeWorkRequest.Builder(SzzSyncWorker.class)
            .setConstraints(constraints)
            .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 1, TimeUnit.MINUTES)
            .build();
        WorkManager.getInstance(context).enqueueUniqueWork(
            "szz-sync-outbox",
            ExistingWorkPolicy.KEEP,
            request
        );
    }

    private JSONObject countsJson() throws JSONException {
        JSONObject result = new JSONObject();
        result.put("protocolDrafts", dao.protocolDraftCount());
        result.put("pendingOutbox", dao.pendingOutboxCount());
        result.put("cachedSites", dao.cachedSiteCount());
        result.put("cachedPhotos", dao.cachedPhotoCount());
        result.put("pendingPhotos", dao.pendingPhotoCount());
        result.put("cachedAttachments", dao.cachedAttachmentCount());
        result.put("pendingAttachments", dao.pendingAttachmentCount());
        return result;
    }

    private OfflineEntities.SiteEntity siteEntityFromCacheItem(JSONObject item, String now) {
        if (item == null) return null;
        JSONObject raw = item.optJSONObject("raw");
        String docId = required(item, "docId", "");
        if (docId.isEmpty() && raw != null) docId = required(raw, "Firebase_doc_id", "");
        if (docId.isEmpty()) docId = required(item, "id", "");
        if (docId.isEmpty()) return null;

        OfflineEntities.SiteEntity site = new OfflineEntities.SiteEntity();
        site.localId = docId;
        site.firebaseId = docId;
        site.name = firstText(raw, item, "N\u00e1zev", "name", "nazev", "Adresa / um\u00edst\u011bn\u00ed", "Adresa_GPS");
        site.address = firstText(raw, item, "Adresa / um\u00edst\u011bn\u00ed", "Adresa_GPS", "address", "adresa");
        site.region = firstText(raw, item, "Kraj", "region", "kraj");
        site.contact = firstText(raw, item, "Kontakt", "contact", "kontakt");
        site.latitude = firstNumber(raw, item, "GPS_lat", "lat", "latitude");
        site.longitude = firstNumber(raw, item, "GPS_lon", "lon", "longitude");
        site.createdAt = firstText(item, raw, "createdAt", "created_at");
        site.updatedAt = firstText(item, raw, "updatedAt", "updated_at", "savedAt");
        if (site.updatedAt == null) site.updatedAt = now;
        site.deletedAt = firstText(item, raw, "deletedAt", "deleted_at");
        site.syncState = SyncState.SYNCED.name();
        site.rawJson = item.toString();
        return site;
    }

    private OfflineEntities.PhotoEntity photoEntityFromPayload(JSONObject payload, String defaultSourceLocalId, String now, boolean pending) {
        JSONObject raw = mediaRawPayload(payload, defaultSourceLocalId);
        if (raw == null) return null;
        String rawJson = raw.toString();
        String localId = firstText(payload, raw, "localId", "photoId", "_id", "id", "firebaseId", "firebaseDocId", "cloudinaryPublicId");
        if (localId == null) {
            String fallback = firstText(raw, "fullUrl", "displayUrl", "thumbUrl", "url", "dataUrl");
            if (fallback != null) localId = "photo-" + Integer.toHexString(fallback.hashCode());
        }
        if (localId == null) return null;

        OfflineEntities.PhotoEntity photo = new OfflineEntities.PhotoEntity();
        photo.localId = localId;
        photo.sourceLocalId = firstText(payload, raw, "sourceLocalId", "siteLocalId", "sourceGroupKey", "sourceIdentity", "siteDocId", "siteKey", "firebaseDocId");
        if (photo.sourceLocalId == null) photo.sourceLocalId = defaultSourceLocalId;
        photo.firebaseId = firstText(payload, raw, "firebaseId", "firebaseDocId", "_id", "id");
        photo.folderDate = firstText(raw, payload, "photoFolder", "folderName", "folder", "cloudinaryFolderDate");
        photo.localOriginalPath = firstText(raw, payload, "localOriginalPath", "localPath", "filePath");
        photo.localThumbPath = firstText(raw, payload, "localThumbPath", "thumbLocalPath");
        photo.cloudinaryUrl = firstText(raw, payload, "cloudinaryUrl", "fullUrl", "displayUrl", "url");
        photo.sha256 = firstText(raw, payload, "sha256", "checksum");
        photo.uploadState = pending || truthy(raw, "_offline") || truthy(raw, "localOnly") ? SyncState.PENDING.name() : SyncState.SYNCED.name();
        photo.uploadedByEmail = firstText(raw, payload, "uploadedBy", "uploadedByEmail", "createdBy", "technicianEmail");
        photo.takenAt = firstText(raw, payload, "takenAt", "createdAt");
        photo.addedAt = firstText(raw, payload, "addedAt", "uploadedAt", "createdAt", "savedAt");
        photo.updatedAt = firstText(raw, payload, "updatedAt", "syncedAt", "uploadedAt", "createdAt");
        if (photo.updatedAt == null) photo.updatedAt = now;
        photo.deletedAt = firstText(raw, payload, "deletedAt", "deleted_at");
        photo.rawJson = rawJson;
        return photo;
    }

    private OfflineEntities.AttachmentEntity attachmentEntityFromPayload(JSONObject payload, String defaultSourceLocalId, String now, boolean pending) {
        JSONObject raw = mediaRawPayload(payload, defaultSourceLocalId);
        if (raw == null) return null;
        String rawJson = raw.toString();
        String localId = firstText(payload, raw, "localId", "attachmentId", "_id", "id", "firebaseId", "firebaseDocId", "fileName");
        if (localId == null) {
            String fallback = firstText(raw, "downloadUrl", "remoteUrl", "url", "dataUrl", "fileName");
            if (fallback != null) localId = "attachment-" + Integer.toHexString(fallback.hashCode());
        }
        if (localId == null) return null;

        OfflineEntities.AttachmentEntity attachment = new OfflineEntities.AttachmentEntity();
        attachment.localId = localId;
        attachment.sourceLocalId = firstText(payload, raw, "sourceLocalId", "siteLocalId", "sourceGroupKey", "sourceIdentity", "siteDocId", "siteKey", "firebaseDocId");
        if (attachment.sourceLocalId == null) attachment.sourceLocalId = defaultSourceLocalId;
        attachment.firebaseId = firstText(payload, raw, "firebaseId", "firebaseDocId", "_id", "id");
        attachment.fileName = firstText(raw, payload, "fileName", "originalFileName", "name");
        attachment.mimeType = firstText(raw, payload, "mimeType", "type");
        attachment.localPath = firstText(raw, payload, "localPath", "filePath");
        attachment.remoteUrl = firstText(raw, payload, "remoteUrl", "downloadUrl", "url", "dataUrl");
        attachment.sha256 = firstText(raw, payload, "sha256", "checksum");
        attachment.uploadState = pending || truthy(raw, "_offline") || truthy(raw, "localOnly") || "localInline".equals(firstText(raw, "storageMode")) ? SyncState.PENDING.name() : SyncState.SYNCED.name();
        attachment.createdAt = firstText(raw, payload, "createdAt", "uploadedAt", "savedAt");
        attachment.updatedAt = firstText(raw, payload, "updatedAt", "uploadedAt", "createdAt");
        if (attachment.updatedAt == null) attachment.updatedAt = now;
        attachment.deletedAt = firstText(raw, payload, "deletedAt", "deleted_at");
        attachment.rawJson = rawJson;
        return attachment;
    }

    private static JSONObject rawPayload(JSONObject payload) {
        if (payload == null) return null;
        JSONObject nested = payload.optJSONObject("payload");
        if (nested != null) return nested;
        String rawText = optional(payload, "payloadJson");
        if (rawText != null) {
            try {
                return new JSONObject(rawText);
            } catch (Exception ignored) {}
        }
        return payload;
    }

    private static JSONObject mediaRawPayload(JSONObject payload, String defaultSourceLocalId) {
        JSONObject raw = rawPayload(payload);
        if (raw == null) return null;
        String siteLocalId = firstText(payload, raw, "siteLocalId", "siteId", "siteKey", "siteDocId", "firebaseDocId");
        String sourceLocalId = firstText(payload, raw, "sourceLocalId", "sourceIdentity", "sourceGroupKey");
        if (sourceLocalId == null) sourceLocalId = defaultSourceLocalId;
        try {
            if (siteLocalId != null) {
                putIfMissing(raw, "siteLocalId", siteLocalId);
                putIfMissing(raw, "siteId", siteLocalId);
                putIfMissing(raw, "siteKey", siteLocalId);
                appendJsonArrayUnique(raw, "siteKeys", siteLocalId);
            }
            if (sourceLocalId != null) {
                putIfMissing(raw, "sourceLocalId", sourceLocalId);
                putIfMissing(raw, "sourceIdentity", sourceLocalId);
            }
        } catch (Exception ignored) {}
        return raw;
    }

    private static void putIfMissing(JSONObject object, String key, String value) throws JSONException {
        if (object == null || key == null || value == null) return;
        if (!object.has(key) || object.isNull(key) || optional(object, key) == null) {
            object.put(key, value);
        }
    }

    private static void appendJsonArrayUnique(JSONObject object, String key, String value) throws JSONException {
        if (object == null || key == null || value == null) return;
        JSONArray values = object.optJSONArray(key);
        if (values == null) {
            values = new JSONArray();
            object.put(key, values);
        }
        for (int i = 0; i < values.length(); i++) {
            if (value.equals(values.optString(i, ""))) return;
        }
        values.put(value);
    }

    private static boolean truthy(JSONObject object, String key) {
        if (object == null || key == null || !object.has(key) || object.isNull(key)) return false;
        Object value = object.opt(key);
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Number) return ((Number) value).doubleValue() != 0;
        String text = String.valueOf(value).trim().toLowerCase(Locale.ROOT);
        return "true".equals(text) || "1".equals(text) || "yes".equals(text) || "ano".equals(text);
    }

    private static String firstText(JSONObject primary, JSONObject secondary, String... keys) {
        String value = firstText(primary, keys);
        if (value != null) return value;
        return firstText(secondary, keys);
    }

    private static String firstText(JSONObject object, String... keys) {
        if (object == null || keys == null) return null;
        for (String key : keys) {
            String value = optional(object, key);
            if (value != null) return value;
        }
        return null;
    }

    private static Double firstNumber(JSONObject primary, JSONObject secondary, String... keys) {
        Double value = firstNumber(primary, keys);
        if (value != null) return value;
        return firstNumber(secondary, keys);
    }

    private static Double firstNumber(JSONObject object, String... keys) {
        if (object == null || keys == null) return null;
        for (String key : keys) {
            if (!object.has(key) || object.isNull(key)) continue;
            Object raw = object.opt(key);
            double value;
            if (raw instanceof Number) {
                value = ((Number) raw).doubleValue();
            } else {
                String text = String.valueOf(raw).trim().replace(',', '.');
                if (text.isEmpty()) continue;
                try {
                    value = Double.parseDouble(text);
                } catch (Exception ignored) {
                    continue;
                }
            }
            if (Double.isNaN(value) || Double.isInfinite(value)) continue;
            return value;
        }
        return null;
    }

    private OfflineEntities.SyncOutboxEntity outboxOperation(
        String operationId,
        String entityTable,
        String entityLocalId,
        String operation,
        String payloadJson,
        String now
    ) {
        OfflineEntities.SyncOutboxEntity row = new OfflineEntities.SyncOutboxEntity();
        row.operationId = operationId;
        row.entityTable = entityTable;
        row.entityLocalId = entityLocalId;
        row.operation = operation;
        row.payloadJson = payloadJson;
        row.attemptCount = 0;
        row.nextRetryAt = 0L;
        row.createdAt = now;
        row.updatedAt = now;
        row.status = SyncState.PENDING.name();
        return row;
    }

    private void run(Callback callback, Task task) {
        executor.execute(() -> {
            try {
                JSONObject result = task.run();
                if (callback != null) callback.onSuccess(result);
            } catch (Exception error) {
                if (callback != null) callback.onError(error);
            }
        });
    }

    private static String required(JSONObject object, String key, String fallback) {
        String value = optional(object, key);
        return value == null || value.trim().isEmpty() ? fallback : value;
    }

    private static String optional(JSONObject object, String key) {
        String value = object == null ? "" : object.optString(key, "");
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private static String compact(Exception error) {
        if (error == null) return "";
        String message = error.getMessage();
        return message == null || message.trim().isEmpty() ? error.getClass().getSimpleName() : message.trim();
    }

    private static String errorJson(Exception error) {
        JSONObject result = new JSONObject();
        try {
            result.put("ok", false);
            result.put("error", compact(error));
        } catch (Exception ignored) {}
        return result.toString();
    }

    private static String isoNow() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date());
    }

    private interface Task {
        JSONObject run() throws Exception;
    }
}
