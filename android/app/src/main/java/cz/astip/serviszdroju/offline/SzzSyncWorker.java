package cz.astip.serviszdroju.offline;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public final class SzzSyncWorker extends Worker {
    public SzzSyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        SzzOfflineDao dao = SzzOfflineDatabase.get(getApplicationContext()).dao();
        long now = System.currentTimeMillis();
        List<OfflineEntities.SyncOutboxEntity> pending = dao.pendingOutbox(now, 25);
        if (pending == null || pending.isEmpty()) return Result.success();

        String updatedAt = isoNow();
        for (OfflineEntities.SyncOutboxEntity operation : pending) {
            int attempt = Math.max(0, operation.attemptCount) + 1;
            dao.updateOutboxState(
                operation.operationId,
                SyncState.PENDING.name(),
                attempt,
                0L,
                updatedAt,
                "Čeká na spuštěnou webovou Firebase relaci pro odeslání."
            );
        }
        return Result.retry();
    }

    private static String isoNow() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.ROOT);
        format.setTimeZone(TimeZone.getTimeZone("UTC"));
        return format.format(new Date());
    }
}
