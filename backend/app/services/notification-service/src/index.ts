import { initTracing } from '@backend/shared';
initTracing('notification-service');

import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loadEnvConfig } from './config/env.js';
import { HealthController } from './presentation/controllers/health.controller.js';
import { registerRoutes } from './presentation/routes/index.js';
import { errorHandler } from './presentation/middleware/error-handler.middleware.js';

// ---- Composition Root -------------------------------------------------------
// This entry point only serves the /health endpoint for monitoring purposes.
// The service's core business logic (Email/Push delivery) is driven by the
// EventBridge-triggered handler at
// src/infrastructure/events/eventbridge/eventbridge-consumer.handler.ts

const env = loadEnvConfig();

const healthController = new HealthController();

const app = Fastify({ logger: true });

app.setErrorHandler(errorHandler);

app.register(async (instance) => {await registerRoutes(instance, { healthController });},{ prefix:'v1' })

// ---- Lambda adapter --------------------------------------------------------

export const handler = awsLambdaFastify(app);

// ---- Local development -----------------------------------------------------

if (env.nodeEnv === 'development' && process.env.RUN_LOCAL === 'true') {
  app.listen({ port: env.port, host: '0.0.0.0' }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
