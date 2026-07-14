import { FastifyInstance } from 'fastify';
import { registerAssignmentRoutes } from './assignment.routes.js';
import { registerCommentRoutes } from './comment.routes.js';
import { registerNotificationRoutes } from './notification.routes.js';
import { AssignmentController } from '../controllers/assignment.controller.js';
import { CommentController } from '../controllers/comment.controller.js';
import { NotificationController } from '../controllers/notification.controller.js';
import { createAuthenticateMiddleware } from '../middleware/authenticate.middleware.js';
import { JwtVerifier } from '../../infrastructure/jwt/jwt-verifier.js';

export interface RouteControllers {
  assignmentController: AssignmentController;
  commentController: CommentController;
  notificationController: NotificationController;
}

export async function registerRoutes(
  app: FastifyInstance,
  controllers: RouteControllers,
  jwtVerifier: JwtVerifier,
): Promise<void> {
  app.addHook('onRequest', createAuthenticateMiddleware(jwtVerifier));

  
  await registerAssignmentRoutes(app, controllers.assignmentController);
  await registerCommentRoutes(app, controllers.commentController);
  await registerNotificationRoutes(app, controllers.notificationController);
}
