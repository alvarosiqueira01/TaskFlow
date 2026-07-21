import { initTracing } from '@backend/shared';
initTracing('task-service');

import Fastify, { FastifyInstance } from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loadEnv } from './config/env';
import { buildDependencies } from './config/dependencies';
import { taskRoutes } from './presentation/routes/task.routes';
import { registerErrorHandler } from './presentation/middleware/error-handler.middleware';
import { unknown } from 'zod';

function buildApp(): { app: FastifyInstance; dispose: () => Promise<void> } {
  const env = loadEnv();
  const dependencies = buildDependencies(env);

  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  registerErrorHandler(app);

  app.register(taskRoutes, {
    taskController: dependencies.taskController,
    jwtVerifier: dependencies.jwtVerifier,
    prefix:'v1'
  });

  app.get('/health', async () => ({ status: 'ok', service: 'task-service' }));

  app.addHook('onClose', async () => {
    await dependencies.dispose();
  });

  return { app, dispose: dependencies.dispose };
}

const { app } = buildApp();

let lambdaHandler: any;

export const handler = async (event: unknown, context: unknown) => {
  if (!lambdaHandler) {
    lambdaHandler = awsLambdaFastify(app);
  }
  return lambdaHandler(event as never, context as never);
  
};

if (require.main === module) {
  const env = loadEnv();
  app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
