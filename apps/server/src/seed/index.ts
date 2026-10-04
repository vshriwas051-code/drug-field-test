import { db } from '../db';
import { operators, devices, kitProfiles, records, auditLog, demoBackups } from '../db/schema';
import { generateKeyPair, signPayload, canonicalize, hashString } from '@chromaseal/core';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

async function seed() {
  console.log('Running migrations...');
  migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  
  console.log('Clearing old data...');
  db.delete(demoBackups).run();
  db.delete(auditLog).run();
  db.delete(records).run();
  db.delete(kitProfiles).run();
  db.delete(devices).run();
  db.delete(operators).run();

  // Clear images
  const imagesDir = path.join(process.cwd(), 'storage/images');
  if (fs.existsSync(imagesDir)) {
    for (const file of fs.readdirSync(imagesDir)) {
      if (file.endsWith('.jpg')) {
        fs.unlinkSync(path.join(imagesDir, file));
      }
    }
  } else {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  console.log('Seeding operators...');
  const passwordHash = bcrypt.hashSync('demo1234', 10);
  
  const ops = [
    { id: 'OP-102', name: 'Vikas Shriwas', role: 'supervisor', passwordHash, active: true, createdAt: new Date().toISOString() },
    { id: 'OP-087', name: 'Field Operator 1', role: 'field_operator', passwordHash, active: true, createdAt: new Date().toISOString() },
    { id: 'OP-103', name: 'Field Operator 2', role: 'field_operator', passwordHash, active: true, createdAt: new Date().toISOString() },
    { id: 'OP-104', name: 'Inactive Operator', role: 'field_operator', passwordHash, active: false, createdAt: new Date().toISOString() },
    { id: 'ADMIN-001', name: 'System Admin', role: 'admin', passwordHash, active: true, createdAt: new Date().toISOString() }
  ];
  db.insert(operators).values(ops).run();
  
  console.log('Seeding devices...');
  const deviceData = [
    { deviceId: 'dev-1', opId: 'OP-087' },
    { deviceId: 'dev-2', opId: 'OP-102' },
    { deviceId: 'dev-3', opId: 'OP-103' }
  ];
  
  // We'll just generate real ed25519 keys for these and register them
  const generatedDevices = deviceData.map(d => {
    const keys = generateKeyPair();
    return {
      deviceId: d.deviceId,
      deviceCode: hashString(keys.publicKeyHex).substring(0, 8), // simplistic deviceCode
      publicKeyHex: keys.publicKeyHex,
      operatorId: d.opId,
      label: `Device ${d.deviceId}`,
      registeredAt: new Date().toISOString(),
      lastSeq: 0,
      lastRecordHash: 'GENESIS'
    };
  });
  
  db.insert(devices).values(generatedDevices).run();
  
  console.log('Seeding kit profiles...');
  const defaultThresholds = {
    sharpnessWarn: 80, sharpnessFail: 40,
    whiteMeanWarn: 130, whiteMeanFail: 90,
    whiteClip: 250,
    glareWarnPct: 1, glareFailPct: 5,
    lightSpreadWarnL: 8,
    calibrationGood: 3, calibrationFail: 6,
    uniformityWarnL: 12,
    sampleMinPixels: 400,
    maxMatchDeltaE: 15,
    ambiguityMargin: 4,
    matchTemperature: 4
  };
  
  const kits = [
    {
      id: 'demo-kit-a',
      version: 1,
      name: 'Demo Kit A',
      manufacturer: 'DEMO — replace with manufacturer chart values',
      isDemo: true,
      readWindowMinS: 60,
      readWindowMaxS: 300,
      classesJson: JSON.stringify([
        { id: 'negative', label: 'Negative', reportedResult: 'PRESUMPTIVE_NEGATIVE', referenceColours: [[90, 0, 20]] }, // approximate lab for #F1E3A1
        { id: 'positive', label: 'Positive', reportedResult: 'PRESUMPTIVE_POSITIVE', referenceColours: [[40, 30, -30]] } // approx lab for #6B3FA0
      ]),
      thresholdsJson: JSON.stringify(defaultThresholds),
      createdBy: 'ADMIN-001',
      createdAt: new Date().toISOString()
    }
  ];
  
  db.insert(kitProfiles).values(kits).run();
  
  console.log('Seed complete. Generate records via demo script or testing API.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
