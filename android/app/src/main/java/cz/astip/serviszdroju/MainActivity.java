package cz.astip.serviszdroju;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.provider.MediaStore;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ServiceWorkerController;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.GetCredentialException;

import com.google.android.libraries.identity.googleid.GetGoogleIdOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import org.json.JSONObject;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.Executor;

public class MainActivity extends Activity {
    private static final String SZZ_WEB_HOST = "serviszdroju.github.io";
    private static final String SZZ_WEB_PATH = "/Mapa";
    private static final int FILE_CHOOSER_REQUEST = 2301;
    private static final int LOCATION_REQUEST = 2302;
    private static final int CAMERA_REQUEST = 2303;
    private static final int NOTIFICATION_REQUEST = 2304;
    private static final Set<String> AUTH_HOSTS = new HashSet<>(Arrays.asList(
        "accounts.google.com",
        "apis.google.com",
        "oauth2.googleapis.com",
        "securetoken.googleapis.com",
        "identitytoolkit.googleapis.com"
    ));

    private WebView webView;
    private ValueCallback<Uri[]> fileChooserCallback;
    private Uri cameraCaptureUri;
    private String pendingGeolocationOrigin;
    private GeolocationPermissions.Callback pendingGeolocationCallback;
    private CancellationSignal googleSignInCancellation;
    private boolean googleSignInBusy;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestNotificationPermissionIfNeeded();
        webView = new WebView(this);
        setContentView(
            webView,
            new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        );
        configureWebView();
        if (savedInstanceState == null) {
            webView.loadUrl(BuildConfig.LAUNCH_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (googleSignInCancellation != null) {
            googleSignInCancellation.cancel();
            googleSignInCancellation = null;
        }
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebView() {
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }
        webView.setBackgroundColor(Color.WHITE);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setCacheMode(isOnline() ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_CACHE_ELSE_NETWORK);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadsImagesAutomatically(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }
        webView.addJavascriptInterface(new AndroidAuthBridge(), "SzzAndroidAuth");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ServiceWorkerController.getInstance().getServiceWorkerWebSettings()
                .setCacheMode(isOnline() ? WebSettings.LOAD_DEFAULT : WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return handleUrl(request.getUrl());
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(Uri.parse(url));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                CookieManager.getInstance().flush();
                injectAndroidBootstrap();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                    request != null &&
                    request.isForMainFrame() &&
                    !isOnline()
                ) {
                    view.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                }
                super.onReceivedError(view, request, error);
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                WebView view,
                ValueCallback<Uri[]> callback,
                FileChooserParams params
            ) {
                if (fileChooserCallback != null) fileChooserCallback.onReceiveValue(null);
                fileChooserCallback = callback;
                try {
                    startActivityForResult(fileChooserIntent(params), FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception error) {
                    fileChooserCallback = null;
                    callback.onReceiveValue(null);
                    return false;
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(
                String origin,
                GeolocationPermissions.Callback callback
            ) {
                if (locationPermissionGranted()) {
                    callback.invoke(origin, true, false);
                    return;
                }
                pendingGeolocationOrigin = origin;
                pendingGeolocationCallback = callback;
                ActivityCompat.requestPermissions(
                    MainActivity.this,
                    new String[]{
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    LOCATION_REQUEST
                );
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (cameraPermissionGranted()) request.grant(request.getResources());
                else request.deny();
            }
        });
    }

    private boolean handleUrl(Uri uri) {
        if (uri == null) return false;
        if (isSzzWebUrl(uri)) return false;
        if (isGoogleAuthUrl(uri)) {
            deliverAndroidAuthError("Google přihlášení se v aplikaci otevírá nativně. Vrať se a stiskni Přihlásit přes Google znovu.");
            return true;
        }
        return openExternalUrl(uri);
    }

    private boolean isSzzWebUrl(Uri uri) {
        return "https".equals(uri.getScheme()) &&
            SZZ_WEB_HOST.equals(uri.getHost()) &&
            uri.getPath() != null &&
            uri.getPath().startsWith(SZZ_WEB_PATH);
    }

    private boolean isGoogleAuthUrl(Uri uri) {
        return "https".equals(uri.getScheme()) && AUTH_HOSTS.contains(uri.getHost());
    }

    private boolean openExternalUrl(Uri uri) {
        try {
            Intent external = new Intent(Intent.ACTION_VIEW, uri);
            external.addCategory(Intent.CATEGORY_BROWSABLE);
            startActivity(external);
            return true;
        } catch (Exception error) {
            return false;
        }
    }

    private void injectAndroidBootstrap() {
        evaluateWebScript(
            "(function(){"
                + "window.__szzAndroidShell=true;"
                + "window.__szzAndroidOfflineWarmup=function(){"
                + "if(window.__szzAndroidOfflineBusy)return;"
                + "window.__szzAndroidOfflineBusy=true;"
                + "Promise.resolve().then(function(){"
                + "if(typeof window.cacheAppShellForOffline==='function')return window.cacheAppShellForOffline({force:false});"
                + "}).then(function(){"
                + "if(typeof window.prepareSzzOfflineAppData==='function')return window.prepareSzzOfflineAppData({reason:'android-auto',silent:true,skipOfflineMap:true});"
                + "}).catch(function(e){console.warn('Android offline priprava selhala',e);"
                + "}).finally(function(){window.__szzAndroidOfflineBusy=false;});"
                + "};"
                + "setTimeout(window.__szzAndroidOfflineWarmup,1500);"
                + "window.addEventListener('online',function(){setTimeout(window.__szzAndroidOfflineWarmup,1500);});"
                + "})();"
        );
    }

    private final class AndroidAuthBridge {
        @JavascriptInterface
        public boolean isGoogleSignInConfigured() {
            return BuildConfig.FIREBASE_GOOGLE_WEB_CLIENT_ID != null &&
                !BuildConfig.FIREBASE_GOOGLE_WEB_CLIENT_ID.trim().isEmpty();
        }

        @JavascriptInterface
        public void startGoogleSignIn() {
            runOnUiThread(() -> startNativeGoogleSignIn());
        }
    }

    private void startNativeGoogleSignIn() {
        if (googleSignInBusy) return;
        String webClientId = BuildConfig.FIREBASE_GOOGLE_WEB_CLIENT_ID == null
            ? ""
            : BuildConfig.FIREBASE_GOOGLE_WEB_CLIENT_ID.trim();
        if (webClientId.isEmpty()) {
            deliverAndroidAuthError("V APK chybí Google OAuth konfigurace. Je potřeba nainstalovat novou APK z tlačítka Stáhnout aplikaci.");
            return;
        }
        googleSignInBusy = true;
        googleSignInCancellation = new CancellationSignal();
        GetGoogleIdOption googleIdOption = new GetGoogleIdOption.Builder()
            .setFilterByAuthorizedAccounts(false)
            .setServerClientId(webClientId)
            .build();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleIdOption)
            .build();
        Executor mainExecutor = ContextCompat.getMainExecutor(this);
        CredentialManager.create(this).getCredentialAsync(
            this,
            request,
            googleSignInCancellation,
            mainExecutor,
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse result) {
                    googleSignInBusy = false;
                    googleSignInCancellation = null;
                    try {
                        GoogleIdTokenCredential credential = googleCredentialFrom(result);
                        String email = credential.getId() == null ? "" : credential.getId().toLowerCase(Locale.ROOT);
                        if (!email.endsWith("@astip.cz")) {
                            deliverAndroidAuthError("Použij firemní účet @astip.cz.");
                            return;
                        }
                        deliverAndroidGoogleIdToken(credential.getIdToken());
                    } catch (Exception error) {
                        deliverAndroidAuthError(error.getMessage() == null ? "Google přihlášení se nepodařilo." : error.getMessage());
                    }
                }

                @Override
                public void onError(GetCredentialException error) {
                    googleSignInBusy = false;
                    googleSignInCancellation = null;
                    deliverAndroidAuthError("Google přihlášení bylo zrušeno nebo se nepodařilo.");
                }
            }
        );
    }

    private GoogleIdTokenCredential googleCredentialFrom(GetCredentialResponse result) {
        Credential credential = result.getCredential();
        if (!(credential instanceof CustomCredential)) {
            throw new IllegalStateException("Google přihlášení nevrátilo očekávaný token.");
        }
        CustomCredential custom = (CustomCredential) credential;
        if (!GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(custom.getType())) {
            throw new IllegalStateException("Google přihlášení nevrátilo očekávaný token.");
        }
        return GoogleIdTokenCredential.createFrom(custom.getData());
    }

    private void deliverAndroidGoogleIdToken(String idToken) {
        evaluateWebScript(
            "window.__szzAndroidSignInWithGoogleIdToken&&window.__szzAndroidSignInWithGoogleIdToken("
                + JSONObject.quote(idToken == null ? "" : idToken)
                + ");"
        );
    }

    private void deliverAndroidAuthError(String message) {
        evaluateWebScript(
            "window.__szzAndroidSignInError&&window.__szzAndroidSignInError("
                + JSONObject.quote(message == null ? "Google přihlášení se nepodařilo." : message)
                + ");"
        );
    }

    private void evaluateWebScript(String script) {
        if (webView == null) return;
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private Intent fileChooserIntent(WebChromeClient.FileChooserParams params) {
        Intent picker;
        try {
            picker = params.createIntent();
        } catch (Exception error) {
            picker = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            picker.addCategory(Intent.CATEGORY_OPENABLE);
            picker.setType("*/*");
        }
        Intent camera = cameraIntentOrNull();
        if (camera == null) return picker;
        Intent chooser = new Intent(Intent.ACTION_CHOOSER);
        chooser.putExtra(Intent.EXTRA_INTENT, picker);
        chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
        return chooser;
    }

    private Intent cameraIntentOrNull() {
        if (!cameraPermissionGranted()) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_REQUEST);
            return null;
        }
        File dir = new File(getCacheDir(), "web-uploads");
        if (!dir.exists()) dir.mkdirs();
        File file = new File(dir, "photo-" + System.currentTimeMillis() + ".jpg");
        Uri uri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", file);
        cameraCaptureUri = uri;
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, uri);
        intent.setClipData(ClipData.newUri(getContentResolver(), "web-upload", uri));
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        return intent;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            ValueCallback<Uri[]> callback = fileChooserCallback;
            fileChooserCallback = null;
            if (callback != null) callback.onReceiveValue(fileChooserResultUris(resultCode, data));
            cameraCaptureUri = null;
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    private Uri[] fileChooserResultUris(int resultCode, Intent data) {
        if (resultCode != RESULT_OK) return null;
        if (data != null && data.getClipData() != null && data.getClipData().getItemCount() > 0) {
            ClipData clip = data.getClipData();
            Uri[] uris = new Uri[clip.getItemCount()];
            for (int i = 0; i < clip.getItemCount(); i++) uris[i] = clip.getItemAt(i).getUri();
            return uris;
        }
        if (data != null && data.getData() != null) return new Uri[]{data.getData()};
        if (cameraCaptureUri != null) return new Uri[]{cameraCaptureUri};
        return null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_REQUEST) {
            boolean granted = false;
            for (int result : grantResults) {
                if (result == PackageManager.PERMISSION_GRANTED) {
                    granted = true;
                    break;
                }
            }
            String origin = pendingGeolocationOrigin;
            GeolocationPermissions.Callback callback = pendingGeolocationCallback;
            pendingGeolocationOrigin = null;
            pendingGeolocationCallback = null;
            if (origin != null && callback != null) callback.invoke(origin, granted, false);
        } else if (requestCode == CAMERA_REQUEST && !cameraPermissionGranted()) {
            Toast.makeText(this, "Kamera není povolená.", Toast.LENGTH_SHORT).show();
        }
    }

    private boolean locationPermissionGranted() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    private boolean cameraPermissionGranted() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return;
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) return;
        ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_REQUEST);
    }

    private boolean isOnline() {
        try {
            ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            if (manager == null) return true;
            Network network = manager.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities capabilities = manager.getNetworkCapabilities(network);
            return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception error) {
            return true;
        }
    }
}
