package cz.astip.serviszdroju.offline;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(
    entities = {
        OfflineEntities.SiteEntity.class,
        OfflineEntities.SourceEntity.class,
        OfflineEntities.ProtocolEntity.class,
        OfflineEntities.ProtocolDraftEntity.class,
        OfflineEntities.PhotoEntity.class,
        OfflineEntities.AttachmentEntity.class,
        OfflineEntities.MySiteEntity.class,
        OfflineEntities.SyncOutboxEntity.class,
        OfflineEntities.SyncCursorEntity.class,
        OfflineEntities.ConflictEntity.class
    },
    version = 1,
    exportSchema = false
)
public abstract class SzzOfflineDatabase extends RoomDatabase {
    private static volatile SzzOfflineDatabase instance;

    public abstract SzzOfflineDao dao();

    public static SzzOfflineDatabase get(Context context) {
        if (instance != null) return instance;
        synchronized (SzzOfflineDatabase.class) {
            if (instance == null) {
                instance = Room.databaseBuilder(
                    context.getApplicationContext(),
                    SzzOfflineDatabase.class,
                    "szz-offline.db"
                ).build();
            }
            return instance;
        }
    }
}
