import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { S3Client } from '@aws-sdk/client-s3';
import { Env } from './env';
import { createDrizzleClient } from '../infrastructure/database/drizzle/client';
import { DrizzleMediaAttachmentRepository } from '../infrastructure/repositories/drizzle-media-attachment.repository';
import { DrizzleMediaUploadSessionRepository } from '../infrastructure/repositories/drizzle-media-upload-session.repository';
import { S3MediaStorageService } from '../infrastructure/storage/s3/s3-media-storage.service';
import { CloudFrontMediaStreamingSigner } from '../infrastructure/storage/cloudfront/cloudfront-media-streaming-signer';
import { EventBridgeEventPublisher } from '../infrastructure/events/eventbridge/eventbridge-event-publisher';
import { HttpTaskAccessVerifier } from '../infrastructure/http/http-task-access-verifier';
import { JwtVerifier } from '../infrastructure/jwt/jwt-verifier';
import { GenerateUploadUrlUseCase } from '../application/use-cases/generate-upload-url.use-case';
import { InitiateMultipartUploadUseCase } from '../application/use-cases/initiate-multipart-upload.use-case';
import { GetMultipartPartUrlsUseCase } from '../application/use-cases/get-multipart-part-urls.use-case';
import { CompleteMultipartUploadUseCase } from '../application/use-cases/complete-multipart-upload.use-case';
import { CompleteMediaUploadUseCase } from '../application/use-cases/complete-media-upload.use-case';
import { GetMediaStreamUrlUseCase } from '../application/use-cases/get-media-stream-url.use-case';
import { GetMediaMetadataUseCase } from '../application/use-cases/get-media-metadata.use-case';
import { DeleteMediaUseCase } from '../application/use-cases/delete-media.use-case';
import { ReplaceMediaUseCase } from '../application/use-cases/replace-media.use-case';
import { MediaController } from '../presentation/controllers/media.controller';

export interface AppDependencies {
  mediaController: MediaController;
  jwtVerifier: JwtVerifier;
  dispose: () => Promise<void>;
}

export function buildDependencies(env: Env): AppDependencies {
  const { db, pool } = createDrizzleClient(env.DATABASE_URL);

  const mediaRepository = new DrizzleMediaAttachmentRepository(db);
  const sessionRepository = new DrizzleMediaUploadSessionRepository(db);

  const s3Client = new S3Client({ region: env.AWS_REGION });
  const storageService = new S3MediaStorageService(s3Client, env.MEDIA_BUCKET_NAME, env.AWS_REGION);

  const streamingSigner = new CloudFrontMediaStreamingSigner({
    domain: env.CLOUDFRONT_DOMAIN,
    keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: env.CLOUDFRONT_PRIVATE_KEY,
  });

  const eventBridgeClient = new EventBridgeClient({ region: env.AWS_REGION });
  const eventPublisher = new EventBridgeEventPublisher(eventBridgeClient, env.EVENT_BUS_NAME);

  const taskAccessVerifier = new HttpTaskAccessVerifier(env.TASK_SERVICE_BASE_URL);
  const jwtVerifier = new JwtVerifier(env.JWT_SECRET);

  const generateUploadUrlUseCase = new GenerateUploadUrlUseCase(
    sessionRepository,
    storageService,
    taskAccessVerifier,
    eventPublisher,
  );
  const initiateMultipartUploadUseCase = new InitiateMultipartUploadUseCase(
    sessionRepository,
    storageService,
    taskAccessVerifier,
    eventPublisher,
  );
  const getMultipartPartUrlsUseCase = new GetMultipartPartUrlsUseCase(sessionRepository, storageService);
  const completeMultipartUploadUseCase = new CompleteMultipartUploadUseCase(
    mediaRepository,
    sessionRepository,
    storageService,
    eventPublisher,
  );
  const completeMediaUploadUseCase = new CompleteMediaUploadUseCase(mediaRepository, sessionRepository, eventPublisher);
  const getMediaStreamUrlUseCase = new GetMediaStreamUrlUseCase(mediaRepository, streamingSigner, taskAccessVerifier);
  const getMediaMetadataUseCase = new GetMediaMetadataUseCase(mediaRepository, taskAccessVerifier);
  const deleteMediaUseCase = new DeleteMediaUseCase(mediaRepository, eventPublisher);
  const replaceMediaUseCase = new ReplaceMediaUseCase(mediaRepository, eventPublisher);

  const mediaController = new MediaController({
    generateUploadUrlUseCase,
    initiateMultipartUploadUseCase,
    getMultipartPartUrlsUseCase,
    completeMultipartUploadUseCase,
    completeMediaUploadUseCase,
    getMediaStreamUrlUseCase,
    getMediaMetadataUseCase,
    deleteMediaUseCase,
    replaceMediaUseCase,
  });

  return {
    mediaController,
    jwtVerifier,
    dispose: async () => {
      await pool.end();
    },
  };
}
