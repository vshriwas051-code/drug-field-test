import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db';
import { devices } from '../db/schema';
import { eq } from 'drizzle-orm';
import { hashString } from '@chromaseal/core';

const registerDeviceSchema = z.object({
  deviceId: z.string(),
  publicKeyHex: z.string()
});

export async function deviceRoutes(fastify: FastifyInstance) {
  fastify.post('/register', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    const { deviceId, publicKeyHex } = registerDeviceSchema.parse(request.body);
    const opId = request.user.id;
    
    const deviceCode = hashString(publicKeyHex).substring(0, 8);
    
    db.insert(devices).values({
      deviceId,
      deviceCode,
      publicKeyHex,
      operatorId: opId,
      label: `Device ${deviceId}`,
      registeredAt: new Date().toISOString(),
      lastSeq: 0,
      lastRecordHash: 'GENESIS'
    }).run();
    
    return { success: true, deviceCode };
  });

  fastify.get('/me', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    const deviceId = request.headers['x-device-id'];
    if (!deviceId) return reply.code(400).send({ error: 'Missing x-device-id header' });
    
    const dev = db.select().from(devices).where(eq(devices.deviceId, deviceId as string)).get();
    if (!dev) return reply.code(404).send({ error: 'Device not found' });
    
    return { lastSeq: dev.lastSeq, lastRecordHash: dev.lastRecordHash };
  });
}
