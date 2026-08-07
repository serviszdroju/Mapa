package cz.astip.serviszdroju;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsServiceConnection;
import androidx.browser.customtabs.CustomTabsSession;
import androidx.browser.trusted.TrustedWebActivityIntent;
import androidx.browser.trusted.TrustedWebActivityIntentBuilder;

public class MainActivity extends Activity {
    private static final Uri LAUNCH_URI = Uri.parse(BuildConfig.LAUNCH_URL);
    private CustomTabsServiceConnection customTabsConnection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        launchTrustedWebActivity();
    }

    private void launchTrustedWebActivity() {
        String providerPackage = CustomTabsClient.getPackageName(this, null);
        if (providerPackage == null) {
            openInBrowser();
            return;
        }

        customTabsConnection = new CustomTabsServiceConnection() {
            @Override
            public void onCustomTabsServiceConnected(ComponentName name, CustomTabsClient client) {
                client.warmup(0L);
                CustomTabsSession session = client.newSession(null);
                if (session == null) {
                    openInBrowser();
                    return;
                }

                TrustedWebActivityIntent trustedIntent =
                    new TrustedWebActivityIntentBuilder(LAUNCH_URI)
                        .setToolbarColor(Color.rgb(15, 23, 42))
                        .setNavigationBarColor(Color.rgb(15, 23, 42))
                        .build(session);

                trustedIntent.launchTrustedWebActivity(MainActivity.this);
                finish();
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {
                customTabsConnection = null;
            }
        };

        boolean bound = CustomTabsClient.bindCustomTabsService(this, providerPackage, customTabsConnection);
        if (!bound) {
            openInBrowser();
        }
    }

    private void openInBrowser() {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, LAUNCH_URI));
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, R.string.no_browser_message, Toast.LENGTH_LONG).show();
        }
        finish();
    }

    @Override
    protected void onDestroy() {
        if (customTabsConnection != null) {
            try {
                unbindService(customTabsConnection);
            } catch (IllegalArgumentException ignored) {
                // The service may already be unbound after the TWA launches.
            }
            customTabsConnection = null;
        }
        super.onDestroy();
    }
}
