package cz.astip.serviszdroju.offline;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.Index;
import androidx.room.PrimaryKey;

public final class OfflineEntities {
    @Entity(
        tableName = "sites",
        indices = {
            @Index("firebase_id"),
            @Index("updated_at"),
            @Index("deleted_at")
        }
    )
    public static class SiteEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "local_id")
        public String localId = "";

        @ColumnInfo(name = "firebase_id")
        public String firebaseId;

        @ColumnInfo(name = "name")
        public String name;

        @ColumnInfo(name = "address")
        public String address;

        @ColumnInfo(name = "region")
        public String region;

        @ColumnInfo(name = "latitude")
        public Double latitude;

        @ColumnInfo(name = "longitude")
        public Double longitude;

        @ColumnInfo(name = "contact")
        public String contact;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "deleted_at")
        public String deletedAt;

        @ColumnInfo(name = "sync_state")
        public String syncState;

        @ColumnInfo(name = "last_sync_error")
        public String lastSyncError;

        @ColumnInfo(name = "raw_json")
        public String rawJson;
    }

    @Entity(
        tableName = "sources",
        indices = {
            @Index("site_local_id"),
            @Index("firebase_id"),
            @Index("updated_at"),
            @Index("deleted_at")
        }
    )
    public static class SourceEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "local_id")
        public String localId = "";

        @ColumnInfo(name = "site_local_id")
        public String siteLocalId;

        @ColumnInfo(name = "firebase_id")
        public String firebaseId;

        @ColumnInfo(name = "device_type")
        public String deviceType;

        @ColumnInfo(name = "serial")
        public String serial;

        @ColumnInfo(name = "location")
        public String location;

        @ColumnInfo(name = "period")
        public String period;

        @ColumnInfo(name = "watch_own_term")
        public Boolean watchOwnTerm;

        @ColumnInfo(name = "stop_state")
        public Boolean stopState;

        @ColumnInfo(name = "ordered_check")
        public Boolean orderedCheck;

        @ColumnInfo(name = "ordered_repair")
        public Boolean orderedRepair;

        @ColumnInfo(name = "breakers_location")
        public String breakersLocation;

        @ColumnInfo(name = "test_procedure")
        public String testProcedure;

        @ColumnInfo(name = "repair_history")
        public String repairHistory;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "deleted_at")
        public String deletedAt;

        @ColumnInfo(name = "sync_state")
        public String syncState;

        @ColumnInfo(name = "last_sync_error")
        public String lastSyncError;

        @ColumnInfo(name = "raw_json")
        public String rawJson;
    }

    @Entity(
        tableName = "protocols",
        indices = {
            @Index("source_local_id"),
            @Index("firebase_id"),
            @Index("saved_at"),
            @Index("updated_at")
        }
    )
    public static class ProtocolEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "local_id")
        public String localId = "";

        @ColumnInfo(name = "source_local_id")
        public String sourceLocalId;

        @ColumnInfo(name = "firebase_id")
        public String firebaseId;

        @ColumnInfo(name = "control_date")
        public String controlDate;

        @ColumnInfo(name = "saved_at")
        public String savedAt;

        @ColumnInfo(name = "technician_email")
        public String technicianEmail;

        @ColumnInfo(name = "client_signature_path")
        public String clientSignaturePath;

        @ColumnInfo(name = "word_export_path")
        public String wordExportPath;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "deleted_at")
        public String deletedAt;

        @ColumnInfo(name = "sync_state")
        public String syncState;

        @ColumnInfo(name = "last_sync_error")
        public String lastSyncError;

        @ColumnInfo(name = "raw_json")
        public String rawJson;
    }

    @Entity(
        tableName = "protocol_drafts",
        indices = {
            @Index("site_local_id"),
            @Index("source_local_id"),
            @Index("saved_at")
        }
    )
    public static class ProtocolDraftEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "draft_id")
        public String draftId = "";

        @ColumnInfo(name = "site_local_id")
        public String siteLocalId;

        @ColumnInfo(name = "source_local_id")
        public String sourceLocalId;

        @ColumnInfo(name = "saved_at")
        public String savedAt;

        @ColumnInfo(name = "payload_json")
        public String payloadJson;
    }

    @Entity(
        tableName = "photos",
        indices = {
            @Index("source_local_id"),
            @Index("firebase_id"),
            @Index("upload_state"),
            @Index("updated_at")
        }
    )
    public static class PhotoEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "local_id")
        public String localId = "";

        @ColumnInfo(name = "source_local_id")
        public String sourceLocalId;

        @ColumnInfo(name = "firebase_id")
        public String firebaseId;

        @ColumnInfo(name = "folder_date")
        public String folderDate;

        @ColumnInfo(name = "local_original_path")
        public String localOriginalPath;

        @ColumnInfo(name = "local_thumb_path")
        public String localThumbPath;

        @ColumnInfo(name = "cloudinary_url")
        public String cloudinaryUrl;

        @ColumnInfo(name = "sha256")
        public String sha256;

        @ColumnInfo(name = "upload_state")
        public String uploadState;

        @ColumnInfo(name = "uploaded_by_email")
        public String uploadedByEmail;

        @ColumnInfo(name = "taken_at")
        public String takenAt;

        @ColumnInfo(name = "added_at")
        public String addedAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "deleted_at")
        public String deletedAt;

        @ColumnInfo(name = "last_sync_error")
        public String lastSyncError;

        @ColumnInfo(name = "raw_json")
        public String rawJson;
    }

    @Entity(
        tableName = "attachments",
        indices = {
            @Index("source_local_id"),
            @Index("firebase_id"),
            @Index("upload_state"),
            @Index("updated_at")
        }
    )
    public static class AttachmentEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "local_id")
        public String localId = "";

        @ColumnInfo(name = "source_local_id")
        public String sourceLocalId;

        @ColumnInfo(name = "firebase_id")
        public String firebaseId;

        @ColumnInfo(name = "file_name")
        public String fileName;

        @ColumnInfo(name = "mime_type")
        public String mimeType;

        @ColumnInfo(name = "local_path")
        public String localPath;

        @ColumnInfo(name = "remote_url")
        public String remoteUrl;

        @ColumnInfo(name = "sha256")
        public String sha256;

        @ColumnInfo(name = "upload_state")
        public String uploadState;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "deleted_at")
        public String deletedAt;

        @ColumnInfo(name = "last_sync_error")
        public String lastSyncError;

        @ColumnInfo(name = "raw_json")
        public String rawJson;
    }

    @Entity(tableName = "my_sites", indices = {@Index("technician_email"), @Index("updated_at")})
    public static class MySiteEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "site_local_id")
        public String siteLocalId = "";

        @ColumnInfo(name = "technician_email")
        public String technicianEmail;

        @ColumnInfo(name = "pinned_at")
        public String pinnedAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;
    }

    @Entity(
        tableName = "sync_outbox",
        indices = {
            @Index("entity_table"),
            @Index("entity_local_id"),
            @Index("status"),
            @Index("next_retry_at")
        }
    )
    public static class SyncOutboxEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "operation_id")
        public String operationId = "";

        @ColumnInfo(name = "entity_table")
        public String entityTable;

        @ColumnInfo(name = "entity_local_id")
        public String entityLocalId;

        @ColumnInfo(name = "operation")
        public String operation;

        @ColumnInfo(name = "payload_json")
        public String payloadJson;

        @ColumnInfo(name = "attempt_count")
        public int attemptCount;

        @ColumnInfo(name = "next_retry_at")
        public long nextRetryAt;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "updated_at")
        public String updatedAt;

        @ColumnInfo(name = "status")
        public String status;

        @ColumnInfo(name = "last_error")
        public String lastError;
    }

    @Entity(tableName = "sync_cursor")
    public static class SyncCursorEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "namespace")
        public String namespace = "";

        @ColumnInfo(name = "cursor_updated_at")
        public String cursorUpdatedAt;

        @ColumnInfo(name = "cursor_document_id")
        public String cursorDocumentId;

        @ColumnInfo(name = "synced_at")
        public String syncedAt;
    }

    @Entity(tableName = "conflicts", indices = {@Index("entity_table"), @Index("entity_local_id"), @Index("created_at")})
    public static class ConflictEntity {
        @PrimaryKey
        @NonNull
        @ColumnInfo(name = "conflict_id")
        public String conflictId = "";

        @ColumnInfo(name = "entity_table")
        public String entityTable;

        @ColumnInfo(name = "entity_local_id")
        public String entityLocalId;

        @ColumnInfo(name = "local_json")
        public String localJson;

        @ColumnInfo(name = "remote_json")
        public String remoteJson;

        @ColumnInfo(name = "created_at")
        public String createdAt;

        @ColumnInfo(name = "resolved_at")
        public String resolvedAt;
    }

    private OfflineEntities() {}
}
