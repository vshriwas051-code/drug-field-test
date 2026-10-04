import { FastifyInstance } from 'fastify';
import { db } from '../db';
import { kitProfiles } from '../db/schema';
import { desc } from 'drizzle-orm';

export async function kitRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const kits = db.select().from(kitProfiles).orderBy(desc(kitProfiles.version)).all();
    return kits.map(k => ({
      ...k,
      classes: JSON.parse(k.classesJson),
      thresholds: JSON.parse(k.thresholdsJson)
    }));
  });

  // POST /kits would be added for supervisors
}
