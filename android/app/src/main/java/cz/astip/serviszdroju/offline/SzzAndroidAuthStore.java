package cz.astip.serviszdroju.offline;

import android.content.Context;
import android.content.SharedPreferences;

public final class SzzAndroidAuthStore {
    private static final String PREFS = "szz-android-auth";
    private static final String GOOGLE_ID_TOKEN = "google_id_token";
    private static final String EMAIL = "email";
    private static final String SAVED_AT = "saved_at";

    private SzzAndroidAuthStore() {}

    public static void saveGoogleIdToken(Context context, String idToken, String email) {
        if (context == null || idToken == null || idToken.trim().isEmpty()) return;
        prefs(context).edit()
            .putString(GOOGLE_ID_TOKEN, idToken.trim())
            .putString(EMAIL, email == null ? "" : email.trim().toLowerCase())
            .putLong(SAVED_AT, System.currentTimeMillis())
            .apply();
    }

    public static String googleIdToken(Context context) {
        return context == null ? "" : prefs(context).getString(GOOGLE_ID_TOKEN, "");
    }

    public static String email(Context context) {
        return context == null ? "" : prefs(context).getString(EMAIL, "");
    }

    public static long savedAt(Context context) {
        return context == null ? 0L : prefs(context).getLong(SAVED_AT, 0L);
    }

    public static boolean hasGoogleIdToken(Context context) {
        String token = googleIdToken(context);
        return token != null && !token.trim().isEmpty();
    }

    public static void clear(Context context) {
        if (context == null) return;
        prefs(context).edit().clear().apply();
    }

    private static SharedPreferences prefs(Context context) {
        return context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
