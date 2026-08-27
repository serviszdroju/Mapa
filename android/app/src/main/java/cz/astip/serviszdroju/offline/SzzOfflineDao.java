package cz.astip.serviszdroju.offline;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface SzzOfflineDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertSite(OfflineEntities.SiteEntity site);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertSites(List<OfflineEntities.SiteEntity> sites);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertSource(OfflineEntities.SourceEntity source);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertProtocol(OfflineEntities.ProtocolEntity protocol);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertProtocolDraft(OfflineEntities.ProtocolDraftEntity draft);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertPhoto(OfflineEntities.PhotoEntity photo);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertPhotos(List<OfflineEntities.PhotoEntity> photos);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertAttachment(OfflineEntities.AttachmentEntity attachment);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertAttachments(List<OfflineEntities.AttachmentEntity> attachments);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertMySite(OfflineEntities.MySiteEntity site);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertSyncCursor(OfflineEntities.SyncCursorEntity cursor);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertConflict(OfflineEntities.ConflictEntity conflict);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void enqueueSyncOperation(OfflineEntities.SyncOutboxEntity operation);

    @Query("SELECT * FROM protocol_drafts WHERE draft_id = :draftId LIMIT 1")
    OfflineEntities.ProtocolDraftEntity protocolDraft(String draftId);

    @Query("DELETE FROM protocol_drafts WHERE draft_id = :draftId")
    void deleteProtocolDraft(String draftId);

    @Query("SELECT COUNT(*) FROM protocol_drafts")
    int protocolDraftCount();

    @Query("SELECT COUNT(*) FROM sites WHERE deleted_at IS NULL")
    int cachedSiteCount();

    @Query("SELECT raw_json FROM sites WHERE deleted_at IS NULL AND raw_json IS NOT NULL AND raw_json != '' ORDER BY updated_at DESC LIMIT :limit")
    List<String> cachedSiteRawJson(int limit);

    @Query("SELECT COUNT(*) FROM photos WHERE deleted_at IS NULL")
    int cachedPhotoCount();

    @Query("SELECT COUNT(*) FROM photos WHERE deleted_at IS NULL AND upload_state != 'SYNCED'")
    int pendingPhotoCount();

    @Query("SELECT raw_json FROM photos WHERE deleted_at IS NULL AND raw_json IS NOT NULL AND raw_json != '' ORDER BY updated_at DESC, added_at DESC LIMIT :limit")
    List<String> cachedPhotoRawJson(int limit);

    @Query("SELECT COUNT(*) FROM attachments WHERE deleted_at IS NULL")
    int cachedAttachmentCount();

    @Query("SELECT COUNT(*) FROM attachments WHERE deleted_at IS NULL AND upload_state != 'SYNCED'")
    int pendingAttachmentCount();

    @Query("SELECT raw_json FROM attachments WHERE deleted_at IS NULL AND raw_json IS NOT NULL AND raw_json != '' ORDER BY updated_at DESC, created_at DESC LIMIT :limit")
    List<String> cachedAttachmentRawJson(int limit);

    @Query("SELECT COUNT(*) FROM sync_outbox WHERE status != 'SYNCED'")
    int pendingOutboxCount();

    @Query("SELECT * FROM sync_outbox WHERE status != 'SYNCED' AND next_retry_at <= :now ORDER BY created_at ASC LIMIT :limit")
    List<OfflineEntities.SyncOutboxEntity> pendingOutbox(long now, int limit);

    @Query("UPDATE sync_outbox SET status = :status, attempt_count = :attemptCount, next_retry_at = :nextRetryAt, updated_at = :updatedAt, last_error = :lastError WHERE operation_id = :operationId")
    void updateOutboxState(String operationId, String status, int attemptCount, long nextRetryAt, String updatedAt, String lastError);

    @Query("UPDATE sync_outbox SET status = 'SYNCED', next_retry_at = 0, updated_at = :updatedAt, last_error = NULL WHERE operation_id = :operationId")
    void markOutboxSynced(String operationId, String updatedAt);
}
