import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { db } from './db';
import { authRoutes } from './routes/auth';
import { deviceRoutes } from './routes/devices';
import { kitRoutes } from './routes/kits';
import { recordRoutes } from './routes/records';

const fastify = Fastify({
  logger: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super_secret'
});

fastify.register(multipart);

fastify.decorate('authenticate', async function (request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(deviceRoutes, { prefix: '/api/devices' });
fastify.register(kitRoutes, { prefix: '/api/kits' });
fastify.register(recordRoutes, { prefix: '/api/records' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000', 10);
    await fastify.listen({ port, host: '127.0.0.1' });
    console.log(`Server listening at http://127.0.0.1:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
