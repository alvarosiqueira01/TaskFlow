import { GetMediaStreamUrlUseCase } from '../../src/application/use-cases/get-media-stream-url.use-case';
import { MediaAttachment } from '../../src/domain/entities/media-attachment.entity';
import { MediaNotFoundError } from '../../src/domain/errors/media-not-found.error';
import { MediaGoneError } from '../../src/domain/errors/media-gone.error';

function buildDeps(media: MediaAttachment | null) {
  const mediaRepository = { save: jest.fn(), findById: jest.fn().mockResolvedValue(media) };
  const signer = {
    generateSignedUrl: jest.fn().mockReturnValue({
      url: 'https://cdn.taskmanager.local/videos/task-1/uuid.mp4?Policy=abc',
      expiresAt: new Date('2026-07-11T00:05:00Z'),
    }),
  };
  const taskAccessVerifier = { assertAccess: jest.fn().mockResolvedValue(undefined) };

  return { mediaRepository, signer, taskAccessVerifier };
}

describe('GetMediaStreamUrlUseCase', () => {
  it('throws MediaNotFoundError when the media does not exist', async () => {
    const deps = buildDeps(null);
    const useCase = new GetMediaStreamUrlUseCase(
      deps.mediaRepository as never,
      deps.signer as never,
      deps.taskAccessVerifier as never,
    );

    await expect(
      useCase.execute({ mediaId: 'missing', requesterId: 'user-1', bearerToken: 'token' }),
    ).rejects.toThrow(MediaNotFoundError);
  });

  it('throws MediaGoneError when the media has been soft-deleted', async () => {
    const media = MediaAttachment.create({
      taskId: 'task-1',
      uploadedBy: 'user-1',
      originalFilename: 'clip.mp4',
      storageKey: 'videos/task-1/uuid.mp4',
      mimeType: 'video/mp4',
      fileSize: 2048,
    });
    media.softDelete();

    const deps = buildDeps(media);
    const useCase = new GetMediaStreamUrlUseCase(
      deps.mediaRepository as never,
      deps.signer as never,
      deps.taskAccessVerifier as never,
    );

    await expect(
      useCase.execute({ mediaId: media.getId(), requesterId: 'user-1', bearerToken: 'token' }),
    ).rejects.toThrow(MediaGoneError);
  });

  it('returns a signed streaming URL after validating task access', async () => {
    const media = MediaAttachment.create({
      taskId: 'task-1',
      uploadedBy: 'user-1',
      originalFilename: 'clip.mp4',
      storageKey: 'videos/task-1/uuid.mp4',
      mimeType: 'video/mp4',
      fileSize: 2048,
    });

    const deps = buildDeps(media);
    const useCase = new GetMediaStreamUrlUseCase(
      deps.mediaRepository as never,
      deps.signer as never,
      deps.taskAccessVerifier as never,
    );

    const result = await useCase.execute({ mediaId: media.getId(), requesterId: 'user-1', bearerToken: 'token' });

    expect(deps.taskAccessVerifier.assertAccess).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'task-1', action: 'VIEW' }),
    );
    expect(result.supportsRanges).toBe(true);
    expect(result.streamUrl).toContain('Policy=');
  });
});
