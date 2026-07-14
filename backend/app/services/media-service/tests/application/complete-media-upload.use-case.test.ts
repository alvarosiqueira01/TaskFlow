import { CompleteMediaUploadUseCase } from '../../src/application/use-cases/complete-media-upload.use-case';
import { MediaUploadSession } from '../../src/domain/entities/media-upload-session.entity';
import { UploadSessionNotFoundError } from '../../src/domain/errors/upload-session-not-found.error';
import { MediaAlreadyConfirmedError } from '../../src/domain/errors/media-already-confirmed.error';

function buildDeps(session: MediaUploadSession | null) {
  const mediaRepository = { save: jest.fn().mockResolvedValue(undefined), findById: jest.fn() };
  const sessionRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(session),
  };
  const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined), publishMany: jest.fn() };

  return { mediaRepository, sessionRepository, eventPublisher };
}

describe('CompleteMediaUploadUseCase', () => {
  it('throws UploadSessionNotFoundError when the session does not exist', async () => {
    const deps = buildDeps(null);
    const useCase = new CompleteMediaUploadUseCase(
      deps.mediaRepository as never,
      deps.sessionRepository as never,
      deps.eventPublisher as never,
    );

    await expect(
      useCase.execute({
        requesterId: 'user-1',
        data: {
          uploadId: 'missing',
          taskId: 'task-1',
          storageKey: 'videos/task-1/uuid.mp4',
          checksum: 'abc123',
          mimeType: 'video/mp4',
          fileSize: 2048,
        },
      }),
    ).rejects.toThrow(UploadSessionNotFoundError);
  });

  it('creates the MediaAttachment and publishes MediaUploaded on first confirmation', async () => {
    const session = MediaUploadSession.create({
      taskId: 'task-1',
      uploadedBy: 'user-1',
      originalFilename: 'clip.mp4',
      contentType: 'video/mp4',
      fileSize: 2048,
      storageKey: 'videos/task-1/uuid.mp4',
      multipart: false,
    });
    const deps = buildDeps(session);
    const useCase = new CompleteMediaUploadUseCase(
      deps.mediaRepository as never,
      deps.sessionRepository as never,
      deps.eventPublisher as never,
    );

    const result = await useCase.execute({
      requesterId: 'user-1',
      data: {
        uploadId: session.getId(),
        taskId: 'task-1',
        storageKey: 'videos/task-1/uuid.mp4',
        checksum: 'abc123',
        mimeType: 'video/mp4',
        fileSize: 2048,
      },
    });

    expect(result.taskId).toBe('task-1');
    expect(deps.mediaRepository.save).toHaveBeenCalledTimes(1);
    expect(deps.sessionRepository.save).toHaveBeenCalledTimes(1);
    expect(deps.eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'MediaUploaded' }),
    );
  });

  it('rejects confirming the same session twice', async () => {
    const session = MediaUploadSession.create({
      taskId: 'task-1',
      uploadedBy: 'user-1',
      originalFilename: 'clip.mp4',
      contentType: 'video/mp4',
      fileSize: 2048,
      storageKey: 'videos/task-1/uuid.mp4',
      multipart: false,
    });
    session.markCompleted();

    const deps = buildDeps(session);
    const useCase = new CompleteMediaUploadUseCase(
      deps.mediaRepository as never,
      deps.sessionRepository as never,
      deps.eventPublisher as never,
    );

    await expect(
      useCase.execute({
        requesterId: 'user-1',
        data: {
          uploadId: session.getId(),
          taskId: 'task-1',
          storageKey: 'videos/task-1/uuid.mp4',
          checksum: 'abc123',
          mimeType: 'video/mp4',
          fileSize: 2048,
        },
      }),
    ).rejects.toThrow(MediaAlreadyConfirmedError);
  });
});
