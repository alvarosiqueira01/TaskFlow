import { initTracing } from '@backend/shared';
initTracing('reporting-service');

import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loadEnvConfig } from './config/env.js';
import { createDrizzleClient } from './infrastructure/database/drizzle/client.js';
import { DrizzleTaskProjectionRepository } from './infrastructure/repositories/drizzle-task-projection.repository.js';
import { JwtVerifier } from './infrastructure/jwt/jwt-verifier.js';

import { GetDashboardReportUseCase } from './application/use-cases/get-dashboard-report.use-case.js';
import { GetCompletedTasksReportUseCase } from './application/use-cases/get-completed-tasks-report.use-case.js';
import { GetPendingTasksReportUseCase } from './application/use-cases/get-pending-tasks-report.use-case.js';

import { ReportController } from './presentation/controllers/report.controller.js';
import { registerRoutes } from './presentation/routes/index.js';
import { errorHandler } from './presentation/middleware/error-handler.middleware.js';

// ---- Composition Root ----------------------------------------------------

const env = loadEnvConfig();

const db = createDrizzleClient(env.databaseUrl);

const taskProjectionRepository = new DrizzleTaskProjectionRepository(db);
const jwtVerifier = new JwtVerifier({ secret: env.jwtSecret, issuer: env.jwtIssuer });

const getDashboardReportUseCase = new GetDashboardReportUseCase(taskProjectionRepository);
const getCompletedTasksReportUseCase = new GetCompletedTasksReportUseCase(taskProjectionRepository);
const getPendingTasksReportUseCase = new GetPendingTasksReportUseCase(taskProjectionRepository);

const reportController = new ReportController(
  getDashboardReportUseCase,
  getCompletedTasksReportUseCase,
  getPendingTasksReportUseCase,
);

// ---- Fastify bootstrap -----------------------------------------------------

const app = Fastify({ logger: true });

app.setErrorHandler(errorHandler);

app.register(async (instance) => {await registerRoutes(instance, { reportController }, jwtVerifier );},{ prefix:'v1' })


app.get('/health', async () => ({ status: 'ok', service: 'reporting-service' }));

// ---- Lambda adapter (HTTP API) --------------------------------------------

export const handler = awsLambdaFastify(app);

// ---- Local development -----------------------------------------------------

if (env.nodeEnv === 'development' && process.env.RUN_LOCAL === 'true') {
  app.listen({ port: env.port, host: '0.0.0.0' }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
