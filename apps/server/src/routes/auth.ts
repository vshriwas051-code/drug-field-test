import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { operators } from '../db/schema';
import { eq } from 'drizzle-orm';

const loginSchema = z.object({
  operatorId: z.string(),
  password: z.string()
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    const { operatorId, password } = loginSchema.parse(request.body);
    
    const op = db.select().from(operators).where(eq(operators.id, operatorId)).get();
    
    if (!op || !op.active) {
      return reply.code(401).send({ error: 'Invalid credentials or inactive operator' });
    }
    
    const valid = bcrypt.compareSync(password, op.passwordHash);
    if (!valid) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }
    
    const token = fastify.jwt.sign({ id: op.id, role: op.role });
    return { token, operator: { id: op.id, name: op.name, role: op.role } };
  });

  fastify.get('/me', {
    preValidation: [fastify.authenticate as any]
  }, async (request: any, reply) => {
    const opId = request.user.id;
    const op = db.select().from(operators).where(eq(operators.id, opId)).get();
    if (!op) return reply.code(404).send();
    return { id: op.id, name: op.name, role: op.role };
  });
}
