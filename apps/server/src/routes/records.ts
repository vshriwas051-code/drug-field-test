import { FastifyInstance } from 'fastify';
import { db } from '../db';
import { records, devices, auditLog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { canonicalize, hashString, hashBytes, verifyRecord } from '@chromaseal/core';
import fs from 'fs';
import path from 'path';

export async function recordRoutes(fastify: FastifyInstance) {
  fastify.post('/', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    const parts = request.parts();
    
    let payloadStr = '';
    let signature = '';
    let imageBuffer: Buffer | null = null;
    let calibratedBuffer: Buffer | null = null;

    for await (const part of parts) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();
        if (part.fieldname === 'image') imageBuffer = buffer;
        if (part.fieldname === 'calibratedImage') calibratedBuffer = buffer;
      } else {
        if (part.fieldname === 'payload') payloadStr = part.value as string;
        if (part.fieldname === 'signature') signature = part.value as string;
      }
    }

    if (!payloadStr || !signature || !imageBuffer) {
      return reply.code(400).send({ error: 'Missing parts' });
    }

    // 1. Validate payload
    let payloadObj: any;
    try {
      payloadObj = JSON.parse(payloadStr);
      if (canonicalize(payloadObj) !== payloadStr) {
        return reply.code(400).send({ error: 'NOT_CANONICAL' });
      }
    } catch {
      return reply.code(400).send({ error: 'NOT_CANONICAL' });
    }

    // 2. Validate device
    const deviceId = payloadObj.deviceId;
    const dev = db.select().from(devices).where(eq(devices.deviceId, deviceId)).get();
    if (!dev) {
      return reply.code(400).send({ error: 'UNKNOWN_DEVICE' });
    }

    // 3. Signature
    const checks = verifyRecord({
      payloadStr,
      signatureHex: signature,
      devicePublicKeyHex: dev.publicKeyHex,
      imageBytes: new Uint8Array(imageBuffer),
      calibratedBytes: calibratedBuffer ? new Uint8Array(calibratedBuffer) : undefined
    });

    const sigCheck = checks.find(c => c.id === 'SIGNATURE');
    if (sigCheck?.status === 'fail') {
      return reply.code(400).send({ error: 'BAD_SIGNATURE' });
    }

    // 4. Image Hash
    const imgCheck = checks.find(c => c.id === 'IMAGE_HASH');
    if (imgCheck?.status === 'fail') {
      return reply.code(400).send({ error: 'IMAGE_HASH_MISMATCH' });
    }

    // 5. Sequence checks
    if (payloadObj.seq !== dev.lastSeq + 1 || payloadObj.prevRecordHash !== dev.lastRecordHash) {
      return reply.code(409).send({ error: 'CHAIN_CONFLICT' });
    }

    // Check if idempotent
    const existing = db.select().from(records).where(eq(records.recordId, payloadObj.recordId)).get();
    if (existing) {
      return reply.code(200).send({ receipt: existing.serverReceiptSig }); // Mock receipt for now
    }

    // 7. Store images and insert row
    const imagesDir = path.join(process.cwd(), 'storage/images');
    const imageHash = payloadObj.image.sha256;
    fs.writeFileSync(path.join(imagesDir, `${imageHash}.jpg`), imageBuffer);
    
    if (calibratedBuffer && payloadObj.calibratedImage) {
      fs.writeFileSync(path.join(imagesDir, `${payloadObj.calibratedImage.sha256}.jpg`), calibratedBuffer);
    }

    const serverReceivedAt = new Date().toISOString();
    const serverReceiptSig = 'MOCK_SERVER_SIG'; // TODO: generate server key and sign

    db.insert(records).values({
      recordId: payloadObj.recordId,
      testId: payloadObj.testId,
      deviceId: payloadObj.deviceId,
      seq: payloadObj.seq,
      operatorId: payloadObj.operatorId,
      kitId: payloadObj.kit.profileId,
      kitVersion: payloadObj.kit.profileVersion,
      kitBatch: payloadObj.kit.batch,
      sampleRef: payloadObj.sampleRef,
      capturedAt: payloadObj.capturedAt,
      lat: payloadObj.location?.lat,
      lon: payloadObj.location?.lon,
      accuracyM: payloadObj.location?.accuracyM,
      locationSource: payloadObj.location?.source,
      locationLabel: null,
      imageSource: payloadObj.image.source,
      machineResult: payloadObj.analysis.machineResult,
      reportedResult: payloadObj.reportedResult,
      matchScore: payloadObj.analysis.matchScore,
      calibrationDeltaE: payloadObj.analysis.calibrationDeltaE?.mean,
      imageSha256: imageHash,
      calibratedSha256: payloadObj.calibratedImage?.sha256,
      payloadJson: payloadStr,
      recordHash: hashString(payloadStr),
      signatureHex: signature,
      prevRecordHash: payloadObj.prevRecordHash,
      serverReceivedAt,
      serverReceiptSig,
      integrityStatus: 'VERIFIED',
      integrityCheckedAt: serverReceivedAt
    }).run();

    // Update device
    db.update(devices)
      .set({ lastSeq: payloadObj.seq, lastRecordHash: hashString(payloadStr) })
      .where(eq(devices.deviceId, dev.deviceId))
      .run();

    // Audit log
    db.insert(auditLog).values({
      at: serverReceivedAt,
      actor: request.user.id,
      action: 'RECORD_SEALED',
      target: payloadObj.recordId,
      detailsJson: JSON.stringify({ seq: payloadObj.seq })
    }).run();

    return reply.code(201).send({ receipt: serverReceiptSig, receivedAt: serverReceivedAt });
  });

  fastify.get('/', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    // Basic search and filtering mock
    // TODO: Implement actual query parameters (q, result, operator, kit, from, to)
    const allRecords = db.select().from(records).orderBy(records.capturedAt).all();
    return allRecords.map(r => ({
      ...r,
      payloadJson: undefined // Don't send large payload string in list
    }));
  });

  fastify.get('/:id', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    const { id } = request.params;
    const record = db.select().from(records).where(eq(records.recordId, id)).get();
    
    if (!record) {
      return reply.code(404).send({ error: 'Record not found' });
    }
    
    return record;
  });
}
