import { initTracing } from '@backend/shared';
initTracing('collaboration-service');

import Fastify from 'fastify';
import awsLambdaFastify from '@fastify/aws-lambda';
import { loadEnvConfig } from './config/env.js';
import { createDrizzleClient } from './infrastructure/database/drizzle/client.js';
import { DrizzleAssignmentRepository } from './infrastructure/repositories/drizzle-assignment.repository.js';
import { DrizzleCommentRepository } from './infrastructure/repositories/drizzle-comment.repository.js';
import { DrizzleNotificationRepository } from './infrastructure/repositories/drizzle-notification.repository.js';
import { DrizzleTaskReferenceRepository } from './infrastructure/repositories/drizzle-task-reference.repository.js';
import { UserDirectoryHttpClient } from './infrastructure/http/user-directory-http-client.js';
import { EventBridgeEventPublisher } from './infrastructure/events/eventbridge/eventbridge-publisher.js';
import { JwtVerifier } from './infrastructure/jwt/jwt-verifier.js';

import { AssignUserToTaskUseCase } from './application/use-cases/assign-user-to-task.use-case.js';
import { RemoveTaskAssignmentUseCase } from './application/use-cases/remove-task-assignment.use-case.js';
import { GetTaskAssignmentsUseCase } from './application/use-cases/get-task-assignments.use-case.js';
import { AddTaskCommentUseCase } from './application/use-cases/add-task-comment.use-case.js';
import { GetTaskCommentsUseCase } from './application/use-cases/get-task-comments.use-case.js';
import { GetNotificationsUseCase } from './application/use-cases/get-notifications.use-case.js';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.use-case.js';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.use-case.js';

import { AssignmentController } from './presentation/controllers/assignment.controller.js';
import { CommentController } from './presentation/controllers/comment.controller.js';
import { NotificationController } from './presentation/controllers/notification.controller.js';
import { registerRoutes } from './presentation/routes/index.js';
import { errorHandler } from './presentation/middleware/error-handler.middleware.js';

// ---- Composition Root ----------------------------------------------------

const env = loadEnvConfig();

const db = createDrizzleClient(env.databaseUrl);

const assignmentRepository = new DrizzleAssignmentRepository(db);
const commentRepository = new DrizzleCommentRepository(db);
const notificationRepository = new DrizzleNotificationRepository(db);
const taskReferenceRepository = new DrizzleTaskReferenceRepository(db);
const userDirectoryRepository = new UserDirectoryHttpClient({
  baseUrl: env.userServiceBaseUrl,
  internalToken: env.userServiceInternalToken,
});
const eventPublisher = new EventBridgeEventPublisher(env.eventBusName, env.awsRegion);
const jwtVerifier = new JwtVerifier({ publicKey: env.jwtPublicKey, issuer: env.jwtIssuer });

const assignUserToTaskUseCase = new AssignUserToTaskUseCase(
  assignmentRepository,
  taskReferenceRepository,
  notificationRepository,
  eventPublisher,
);
const removeTaskAssignmentUseCase = new RemoveTaskAssignmentUseCase(assignmentRepository, taskReferenceRepository);
const getTaskAssignmentsUseCase = new GetTaskAssignmentsUseCase(
  assignmentRepository,
  taskReferenceRepository,
  userDirectoryRepository,
);
const addTaskCommentUseCase = new AddTaskCommentUseCase(
  commentRepository,
  taskReferenceRepository,
  notificationRepository,
  eventPublisher,
);
const getTaskCommentsUseCase = new GetTaskCommentsUseCase(commentRepository, taskReferenceRepository);
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepository);
const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase(notificationRepository);

const assignmentController = new AssignmentController(
  assignUserToTaskUseCase,
  removeTaskAssignmentUseCase,
  getTaskAssignmentsUseCase,
);
const commentController = new CommentController(addTaskCommentUseCase, getTaskCommentsUseCase);
const notificationController = new NotificationController(
  getNotificationsUseCase,
  markNotificationReadUseCase,
  markAllNotificationsReadUseCase,
);

// ---- Fastify bootstrap -----------------------------------------------------

const app = Fastify({ logger: true });

app.setErrorHandler(errorHandler);


app.register(async (instance) => {await registerRoutes(instance, { assignmentController, commentController, notificationController }, jwtVerifier);})


app.get('/health', async () => ({ status: 'ok', service: 'collaboration-service' }));

// ---- Lambda adapter --------------------------------------------------------

export const handler = awsLambdaFastify(app);

// ---- Local development -----------------------------------------------------

if (env.nodeEnv === 'development' && process.env.RUN_LOCAL === 'true') {
  app.listen({ port: env.port, host: '0.0.0.0' }).catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
}
