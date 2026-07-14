import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { mediaRoutes } from '../../src/presentation/routes/media.routes';
import { MediaController } from '../../src/presentation/controllers/media.controller';
import { registerErrorHandler } from '../../src/presentation/middleware/error-handler.middleware';
import { JwtVerifier } from '../../src/infrastructure/jwt/jwt-verifier';

const JWT_SECRET = 'test-secret';

function buildToken(userId: string, roles: string[] = []): string {
  return jwt.sign({ sub: userId, roles }, JWT_SECRET, { expiresIn: '1h' });
}

function buildApp() {
  const app = Fastify();
  registerErrorHandler(app);

  const mediaController = new MediaController({
    generateUploadUrlUseCase: {
      execute: jest.fn().mockResolvedValue({
        uploadUrl: 'https://bucket.s3.amazonaws.com/videos/task-1/uuid.mp4',
        uploadId: '11111111-1111-1111-1111-111111111111',
        storageKey: 'videos/task-1/uuid.mp4',
        expiresIn: 600,
        method: 'PUT',
        bucket: 'media-bucket',
        region: 'us-east-1',
        allowedHeaders: ['Content-Type', 'Content-Length'],
      }),
    } as never,
    initiateMultipartUploadUseCase: { execute: jest.fn() } as never,
    getMultipartPartUrlsUseCase: { execute: jest.fn() } as never,
    completeMultipartUploadUseCase: { execute: jest.fn() } as never,
    completeMediaUploadUseCase: { execute: jest.fn() } as never,
    getMediaStreamUrlUseCase: {
      execute: jest.fn().mockResolvedValue({
        streamUrl: 'https://cdn.taskmanager.local/videos/task-1/uuid.mp4?Policy=abc',
        expiresAt: new Date().toISOString(),
        contentType: 'video/mp4',
        supportsRanges: true,
      }),
    } as never,
    getMediaMetadataUseCase: { execute: jest.fn() } as never,
    deleteMediaUseCase: { execute: jest.fn().mockResolvedValue(undefined) } as never,
    replaceMediaUseCase: { execute: jest.fn() } as never,
  });

  app.register(mediaRoutes, {
    mediaController,
    jwtVerifier: new JwtVerifier(JWT_SECRET),
  });

  return app;
}

describe('Media routes', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const app = buildApp();
    const response = await app.inject({ method: 'POST', url: '/media/upload-url', payload: {} });
    expect(response.statusCode).toBe(401);
  });

  it('returns 200 with presigned upload details on POST /media/upload-url', async () => {
    const app = buildApp();
    const token = buildToken('user-1');

    const response = await app.inject({
      method: 'POST',
      url: '/media/upload-url',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        taskId: '22222222-2222-2222-2222-222222222222',
        filename: 'clip.mp4',
        contentType: 'video/mp4',
        fileSize: 2048,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().bucket).toBe('media-bucket');
  });

  it('returns 400 when the upload-url payload has an unsupported content type', async () => {
    const app = buildApp();
    const token = buildToken('user-1');

    const response = await app.inject({
      method: 'POST',
      url: '/media/upload-url',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        taskId: '22222222-2222-2222-2222-222222222222',
        filename: 'clip.pdf',
        contentType: 'application/pdf',
        fileSize: 2048,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
