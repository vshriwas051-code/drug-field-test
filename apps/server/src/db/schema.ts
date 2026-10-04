import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const operators = sqliteTable('operators', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  passwordHash: text('password_hash').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull()
});

export const devices = sqliteTable('devices', {
  deviceId: text('device_id').primaryKey(),
  deviceCode: text('device_code').notNull(),
  publicKeyHex: text('public_key_hex').notNull(),
  operatorId: text('operator_id').notNull(),
  label: text('label'),
  registeredAt: text('registered_at').notNull(),
  lastSeq: integer('last_seq').notNull().default(0),
  lastRecordHash: text('last_record_hash')
});

export const kitProfiles = sqliteTable('kit_profiles', {
  id: text('id').notNull(),
  version: integer('version').notNull(),
  name: text('name').notNull(),
  manufacturer: text('manufacturer').notNull(),
  isDemo: integer('is_demo', { mode: 'boolean' }).notNull().default(false),
  readWindowMinS: integer('read_window_min_s'),
  readWindowMaxS: integer('read_window_max_s'),
  classesJson: text('classes_json').notNull(),
  thresholdsJson: text('thresholds_json').notNull(),
  createdBy: text('created_by'),
  createdAt: text('created_at').notNull()
});

export const records = sqliteTable('records', {
  recordId: text('record_id').primaryKey(),
  testId: text('test_id').notNull(),
  deviceId: text('device_id').notNull(),
  seq: integer('seq').notNull(),
  operatorId: text('operator_id').notNull(),
  kitId: text('kit_id').notNull(),
  kitVersion: integer('kit_version').notNull(),
  kitBatch: text('kit_batch'),
  sampleRef: text('sample_ref').notNull(),
  capturedAt: text('captured_at').notNull(),
  lat: real('lat'),
  lon: real('lon'),
  accuracyM: real('accuracy_m'),
  locationSource: text('location_source'),
  locationLabel: text('location_label'),
  imageSource: text('image_source'),
  machineResult: text('machine_result').notNull(),
  reportedResult: text('reported_result').notNull(),
  matchScore: real('match_score'),
  calibrationDeltaE: real('calibration_delta_e'),
  imageSha256: text('image_sha256').notNull(),
  calibratedSha256: text('calibrated_sha256'),
  payloadJson: text('payload_json').notNull(),
  recordHash: text('record_hash').notNull(),
  signatureHex: text('signature_hex').notNull(),
  prevRecordHash: text('prev_record_hash').notNull(),
  serverReceivedAt: text('server_received_at').notNull(),
  serverReceiptSig: text('server_receipt_sig').notNull(),
  integrityStatus: text('integrity_status').notNull(),
  integrityCheckedAt: text('integrity_checked_at').notNull()
});

export const auditLog = sqliteTable('audit_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  at: text('at').notNull(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  target: text('target'),
  detailsJson: text('details_json')
});

export const demoBackups = sqliteTable('demo_backups', {
  recordId: text('record_id').primaryKey(),
  payloadJson: text('payload_json').notNull(),
  imageBytes: text('image_bytes') // or blob, keeping text for base64 or simply blob if needed. Assuming base64.
});
