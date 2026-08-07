package cz.astip.serviszdroju.offline;

public final class OfflineTables {
    public static final int SCHEMA_VERSION = 1;

    public static final String SITES = "sites";
    public static final String SOURCES = "sources";
    public static final String PROTOCOLS = "protocols";
    public static final String PHOTOS = "photos";
    public static final String SYNC_QUEUE = "sync_queue";

    public static final class Common {
        public static final String LOCAL_ID = "local_id";
        public static final String FIREBASE_ID = "firebase_id";
        public static final String CREATED_AT = "created_at";
        public static final String UPDATED_AT = "updated_at";
        public static final String DELETED_AT = "deleted_at";
        public static final String SYNC_STATE = "sync_state";
        public static final String LAST_SYNC_ERROR = "last_sync_error";

        private Common() {}
    }

    public static final class Site {
        public static final String NAME = "name";
        public static final String ADDRESS = "address";
        public static final String REGION = "region";
        public static final String LATITUDE = "latitude";
        public static final String LONGITUDE = "longitude";
        public static final String CONTACT = "contact";
        public static final String RAW_JSON = "raw_json";

        private Site() {}
    }

    public static final class Source {
        public static final String SITE_LOCAL_ID = "site_local_id";
        public static final String DEVICE_TYPE = "device_type";
        public static final String SERIAL = "serial";
        public static final String LOCATION = "location";
        public static final String PERIOD = "period";
        public static final String WATCH_OWN_TERM = "watch_own_term";
        public static final String STOP_STATE = "stop_state";
        public static final String ORDERED_CHECK = "ordered_check";
        public static final String ORDERED_REPAIR = "ordered_repair";
        public static final String BREAKERS_LOCATION = "breakers_location";
        public static final String TEST_PROCEDURE = "test_procedure";
        public static final String REPAIR_HISTORY = "repair_history";
        public static final String RAW_JSON = "raw_json";

        private Source() {}
    }

    public static final class Protocol {
        public static final String SOURCE_LOCAL_ID = "source_local_id";
        public static final String CONTROL_DATE = "control_date";
        public static final String SAVED_AT = "saved_at";
        public static final String TECHNICIAN_EMAIL = "technician_email";
        public static final String CLIENT_SIGNATURE_PATH = "client_signature_path";
        public static final String WORD_EXPORT_PATH = "word_export_path";
        public static final String RAW_JSON = "raw_json";

        private Protocol() {}
    }

    public static final class Photo {
        public static final String SOURCE_LOCAL_ID = "source_local_id";
        public static final String FOLDER_DATE = "folder_date";
        public static final String LOCAL_ORIGINAL_PATH = "local_original_path";
        public static final String LOCAL_THUMB_PATH = "local_thumb_path";
        public static final String CLOUDINARY_URL = "cloudinary_url";
        public static final String UPLOADED_BY_EMAIL = "uploaded_by_email";
        public static final String TAKEN_AT = "taken_at";
        public static final String ADDED_AT = "added_at";

        private Photo() {}
    }

    public static final class SyncQueue {
        public static final String ENTITY_TABLE = "entity_table";
        public static final String ENTITY_LOCAL_ID = "entity_local_id";
        public static final String OPERATION = "operation";
        public static final String PAYLOAD_JSON = "payload_json";
        public static final String ATTEMPT_COUNT = "attempt_count";
        public static final String NEXT_RETRY_AT = "next_retry_at";

        private SyncQueue() {}
    }

    private OfflineTables() {}
}
