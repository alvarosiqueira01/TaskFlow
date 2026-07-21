import { initTracing } from '@backend/shared';
initTracing('category-service');

import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loadEnvConfig } from './config/env.js';
import { createDrizzleClient } from './infrastructure/database/drizzle/client.js';
import { DrizzleCategoryRepository } from './infrastructure/repositories/drizzle-category.repository.js';
import { EventBridgeEventPublisher } from './infrastructure/events/eventbridge/eventbridge-publisher.js';
import { JwtVerifier } from './infrastructure/jwt/jwt-verifier.js';

import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case.js';
import { ListCategoriesUseCase } from './application/use-cases/list-categories.use-case.js';

import { CategoryController } from './presentation/controllers/category.controller.js';
import { registerRoutes } from './presentation/routes/index.js';
import { errorHandler } from './presentation/middleware/error-handler.middleware.js';

// ---- Composition Root ----------------------------------------------------

const env = loadEnvConfig();

const db = createDrizzleClient(env.databaseUrl);

const categoryRepository = new DrizzleCategoryRepository(db);
const eventPublisher = new EventBridgeEventPublisher(env.eventBusName, env.awsRegion);
const jwtVerifier = new JwtVerifier({ secret: env.jwtSecret, issuer: env.jwtIssuer });

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository, eventPublisher);
const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);

const categoryController = new CategoryController(createCategoryUseCase, listCategoriesUseCase);

// ---- Fastify bootstrap -----------------------------------------------------

const app = Fastify({ logger: true });

app.setErrorHandler(errorHandler);

app.register(async (instance) => {await registerRoutes(instance, { categoryController }, jwtVerifier);},{prefix:'v1'})

app.get('/health', async () => ({ status: 'ok', service: 'category-service' }));

// ---- Lambda adapter --------------------------------------------------------

export const handler = awsLambdaFastify(app);

// ---- Local development -----------------------------------------------------

if (env.nodeEnv === 'development' && process.env.RUN_LOCAL === 'true') {
  app.listen({ port: env.port, host: '0.0.0.0' }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
