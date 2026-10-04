import { describe, it, expect, beforeAll } from 'vitest';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { recordRoutes } from '../src/routes/records';
import { db } from '../src/db';
import { devices, operators, kitProfiles } from '../src/db/schema';
import { generateKeyPair, signPayload, canonicalize, hashBytes, hashString } from '@chromaseal/core';

describe('POST /records', () => {
  let fastify: any;
  let deviceKeys: any;
  let testDeviceId = 'test-device-1';
  let opId = 'OP-102';
  let token = '';

  beforeAll(async () => {
    fastify = Fastify();
    fastify.register(jwt, { secret: 'test-secret' });
    fastify.register(multipart);
    fastify.decorate('authenticate', async (request: any, reply: any) => {
      try { await request.jwtVerify(); } catch (err) { reply.send(err); }
    });
    fastify.register(recordRoutes, { prefix: '/api/records' });
    
    await fastify.ready();
    
    token = fastify.jwt.sign({ id: opId, role: 'supervisor' });
    deviceKeys = generateKeyPair();

    db.delete(devices).run();
    db.insert(devices).values({
      deviceId: testDeviceId,
      deviceCode: 'TESTDEV1',
      publicKeyHex: deviceKeys.publicKeyHex,
      operatorId: opId,
      registeredAt: new Date().toISOString(),
      lastSeq: 0,
      lastRecordHash: 'GENESIS'
    }).run();
  });

  const generateValidPayload = (seq: number, prevHash: string) => {
    const imgBytes = new Uint8Array([1, 2, 3]);
    const imgHash = hashBytes(imgBytes);
    const obj = {
      schema: "chromaseal.record/1",
      recordId: `REC-${seq}`,
      testId: `TEST-${seq}`,
      deviceId: testDeviceId,
      seq,
      prevRecordHash: prevHash,
      operatorId: opId,
      capturedAt: new Date().toISOString(),
      kit: { profileId: 'demo-kit-a', profileVersion: 1, batch: 'B1' },
      sampleRef: 'S1',
      image: { sha256: imgHash, source: 'upload' },
      analysis: { machineResult: 'PRESUMPTIVE_NEGATIVE', matchScore: 0.9, calibrationDeltaE: { mean: 1 } },
      reportedResult: 'PRESUMPTIVE_NEGATIVE',
      operatorReview: { decision: 'agree' }
    };
    const payload = canonicalize(obj);
    const sig = signPayload(payload, deviceKeys.privateKeyHex);
    return { payload, sig, imgBytes, imgHash, recordHash: hashString(payload) };
  };

  it('rejects bad signature', async () => {
    const { payload, imgBytes } = generateValidPayload(1, 'GENESIS');
    const badSig = signPayload(payload, generateKeyPair().privateKeyHex); // wrong key

    const form = new FormData();
    form.append('payload', payload);
    form.append('signature', badSig);
    form.append('image', new Blob([imgBytes]), 'image.jpg');

    const res = await fastify.inject({
      method: 'POST',
      url: '/api/records',
      headers: { authorization: `Bearer ${token}` },
      payload: form
    });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).error).toBe('BAD_SIGNATURE');
  });

  it('rejects wrong image', async () => {
    const { payload, sig } = generateValidPayload(1, 'GENESIS');
    const badImgBytes = new Uint8Array([1, 2, 4]);

    const form = new FormData();
    form.append('payload', payload);
    form.append('signature', sig);
    form.append('image', new Blob([badImgBytes]), 'image.jpg');

    const res = await fastify.inject({
      method: 'POST',
      url: '/api/records',
      headers: { authorization: `Bearer ${token}` },
      payload: form
    });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.payload).error).toBe('IMAGE_HASH_MISMATCH');
  });

  it('accepts valid record and rejects skipped seq', async () => {
    const { payload, sig, imgBytes, recordHash } = generateValidPayload(1, 'GENESIS');
    
    const form1 = new FormData();
    form1.append('payload', payload);
    form1.append('signature', sig);
    form1.append('image', new Blob([imgBytes]), 'image.jpg');

    const res1 = await fastify.inject({
      method: 'POST',
      url: '/api/records',
      headers: { authorization: `Bearer ${token}` },
      payload: form1
    });
    
    expect(res1.statusCode).toBe(201);

    // Skipped seq (should be 2, passing 3)
    const next = generateValidPayload(3, recordHash);
    const form2 = new FormData();
    form2.append('payload', next.payload);
    form2.append('signature', next.sig);
    form2.append('image', new Blob([next.imgBytes]), 'image.jpg');

    const res2 = await fastify.inject({
      method: 'POST',
      url: '/api/records',
      headers: { authorization: `Bearer ${token}` },
      payload: form2
    });

    expect(res2.statusCode).toBe(409);
    expect(JSON.parse(res2.payload).error).toBe('CHAIN_CONFLICT');
  });
});
