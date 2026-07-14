import { initTracing } from '@backend/shared';
initTracing('auth-service');

import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import cors from '@fastify/cors';
import { correlationIdMiddleware, buildRequestLoggerMiddleware } from '@backend/shared';
import { loadAuthServiceEnv } from './config/env';
import { buildContainer } from './config/container';
import { registerRoutes } from './presentation/routes';
import { problemDetailsErrorHandler } from './presentation/middleware/problem-details-error-handler';

const env = loadAuthServiceEnv();
const container = buildContainer(env);

const fastify = Fastify({ logger: false, trustProxy: true });

fastify.register(cors, {
  origin: 'http://localhost:5173', 
  credentials: true,
});

fastify.addHook('onRequest', correlationIdMiddleware);
fastify.addHook('onRequest', buildRequestLoggerMiddleware(container.logger));

fastify.setErrorHandler(problemDetailsErrorHandler);

fastify.register(async (instance) => {
  await registerRoutes(instance, container);
}, { prefix: '/v1' });

fastify.get('/health', async () => ({ status: 'ok', service: env.SERVICE_NAME }));

// AWS Lambda adapter (production/staging entry point).
export const handler = awsLambdaFastify(fastify);

// Local development entry point.
if (require.main === module) {
  fastify
    .listen({ port: 3000, host: '0.0.0.0' })
    .then(() => container.logger.info(`${env.SERVICE_NAME} listening on port 3000`))
    .catch((error) => {
      container.logger.error({ err: error }, 'failed to start server');
      process.exit(1);
    });
}
