import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MediaController } from '../controllers/media.controller';
import { createAuthMiddleware } from '../middleware/auth.middleware';
import { JwtVerifier } from '../../infrastructure/jwt/jwt-verifier';

export interface MediaRoutesOptions extends FastifyPluginOptions {
  mediaController: MediaController;
  jwtVerifier: JwtVerifier;
}

export async function mediaRoutes(app: FastifyInstance, options: MediaRoutesOptions): Promise<void> {
  const { mediaController, jwtVerifier } = options;
  const authenticate = createAuthMiddleware(jwtVerifier);

  app.addHook('preHandler', authenticate);

  // OpenAPI-defined routes (_A6_swagger.yaml)
  app.post('/media/upload-url', mediaController.generateUploadUrl);
  app.post('/media/multipart', mediaController.initiateMultipartUpload);
  app.post('/media/multipart/:id/parts', mediaController.getMultipartPartUrls);
  app.post('/media/multipart/:id/complete', mediaController.completeMultipartUpload);
  app.post('/media/complete', mediaController.completeMediaUpload);
  app.get('/media/:id/stream', mediaController.getStreamUrl);

  // Spec extensions — see (A5)streaming-design.md §13 and FR-31/32/33
  app.get('/media/:id', mediaController.getMetadata);
  app.delete('/media/:id', mediaController.remove);
  app.put('/media/:id', mediaController.replace);
}
