CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`at` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text,
	`details_json` text
);
--> statement-breakpoint
CREATE TABLE `demo_backups` (
	`record_id` text PRIMARY KEY NOT NULL,
	`payload_json` text NOT NULL,
	`image_bytes` text
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`device_id` text PRIMARY KEY NOT NULL,
	`device_code` text NOT NULL,
	`public_key_hex` text NOT NULL,
	`operator_id` text NOT NULL,
	`label` text,
	`registered_at` text NOT NULL,
	`last_seq` integer DEFAULT 0 NOT NULL,
	`last_record_hash` text
);
--> statement-breakpoint
CREATE TABLE `kit_profiles` (
	`id` text NOT NULL,
	`version` integer NOT NULL,
	`name` text NOT NULL,
	`manufacturer` text NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`read_window_min_s` integer,
	`read_window_max_s` integer,
	`classes_json` text NOT NULL,
	`thresholds_json` text NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `operators` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`record_id` text PRIMARY KEY NOT NULL,
	`test_id` text NOT NULL,
	`device_id` text NOT NULL,
	`seq` integer NOT NULL,
	`operator_id` text NOT NULL,
	`kit_id` text NOT NULL,
	`kit_version` integer NOT NULL,
	`kit_batch` text,
	`sample_ref` text NOT NULL,
	`captured_at` text NOT NULL,
	`lat` real,
	`lon` real,
	`accuracy_m` real,
	`location_source` text,
	`location_label` text,
	`image_source` text,
	`machine_result` text NOT NULL,
	`reported_result` text NOT NULL,
	`match_score` real,
	`calibration_delta_e` real,
	`image_sha256` text NOT NULL,
	`calibrated_sha256` text,
	`payload_json` text NOT NULL,
	`record_hash` text NOT NULL,
	`signature_hex` text NOT NULL,
	`prev_record_hash` text NOT NULL,
	`server_received_at` text NOT NULL,
	`server_receipt_sig` text NOT NULL,
	`integrity_status` text NOT NULL,
	`integrity_checked_at` text NOT NULL
);
