import { GenerateUploadUrlUseCase } from '../../src/application/use-cases/generate-upload-url.use-case';
import { MediaTooLargeError } from '../../src/domain/errors/media-too-large.error';
import { MAX_FILE_SIZE_BYTES } from '../../src/domain/constants/media.constants';

function buildDeps() {
  const sessionRepository = { save: jest.fn().mockResolvedValue(undefined), findById: jest.fn() };
  const storageService = {
    buildObjectKey: jest.fn().mockReturnValue('videos/task-1/uuid.mp4'),
    generatePresignedPutUrl: jest.fn().mockResolvedValue({
      url: 'https://bucket.s3.amazonaws.com/videos/task-1/uuid.mp4',
      expiresIn: 600,
      method: 'PUT',
      headers: ['Content-Type', 'Content-Length'],
    }),
    createMultipartUpload: jest.fn(),
    generateMultipartPartUrls: jest.fn(),
    completeMultipartUpload: jest.fn(),
    deleteObject: jest.fn(),
    getBucketName: jest.fn().mockReturnValue('media-bucket'),
    getRegion: jest.fn().mockReturnValue('us-east-1'),
  };
  const taskAccessVerifier = { assertAccess: jest.fn().mockResolvedValue(undefined) };
  const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined), publishMany: jest.fn() };

  return { sessionRepository, storageService, taskAccessVerifier, eventPublisher: { 
      publish: jest.fn() 
    } };
}

describe('GenerateUploadUrlUseCase', () => {
  it('validates task access, persists a session, and returns a presigned URL', async () => {
    const deps = buildDeps();
    const useCase = new GenerateUploadUrlUseCase(
      deps.sessionRepository as never,
      deps.storageService as never,
      deps.taskAccessVerifier as never,
      deps.eventPublisher as never,
    );

    const result = await useCase.execute({
      requesterId: 'user-1',
      bearerToken: 'token-123',
      data: { taskId: 'task-1', filename: 'clip.mp4', contentType: 'video/mp4', fileSize: 2048 },
    });

    expect(deps.taskAccessVerifier.assertAccess).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'task-1', action: 'MODIFY', bearerToken: 'token-123' }),
    );
    expect(deps.sessionRepository.save).toHaveBeenCalledTimes(1);
    expect(deps.eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'MediaUploadRequested' }),
    );
    expect(result.storageKey).toBe('videos/task-1/uuid.mp4');
    expect(result.bucket).toBe('media-bucket');
  });

  it('rejects files exceeding the maximum allowed size', async () => {
    const deps = buildDeps();
    const useCase = new GenerateUploadUrlUseCase(
      deps.sessionRepository as never,
      deps.storageService as never,
      deps.taskAccessVerifier as never,
      deps.eventPublisher as never,
    );

    await expect(
      useCase.execute({
        requesterId: 'user-1',
        bearerToken: 'token-123',
        data: {
          taskId: 'task-1',
          filename: 'huge.mp4',
          contentType: 'video/mp4',
          fileSize: MAX_FILE_SIZE_BYTES + 1,
        },
      }),
    ).rejects.toThrow(MediaTooLargeError);

    expect(deps.taskAccessVerifier.assertAccess).not.toHaveBeenCalled();
  });
});
