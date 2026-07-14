import { DeleteMediaUseCase } from '../../src/application/use-cases/delete-media.use-case';
import { MediaAttachment } from '../../src/domain/entities/media-attachment.entity';
import { MediaAccessDeniedError } from '../../src/domain/errors/media-access-denied.error';

function buildDeps(media: MediaAttachment | null) {
  const mediaRepository = { save: jest.fn().mockResolvedValue(undefined), findById: jest.fn().mockResolvedValue(media) };
  const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined), publishMany: jest.fn() };
  return { mediaRepository, eventPublisher };
}

describe('DeleteMediaUseCase', () => {
  it('denies deletion to a user who is not the uploader nor an admin', async () => {
    const media = MediaAttachment.create({
      taskId: 'task-1',
      uploadedBy: 'owner-1',
      originalFilename: 'clip.mp4',
      storageKey: 'videos/task-1/uuid.mp4',
      mimeType: 'video/mp4',
      fileSize: 2048,
    });
    const deps = buildDeps(media);
    const useCase = new DeleteMediaUseCase(deps.mediaRepository as never, deps.eventPublisher as never);

    await expect(
      useCase.execute({ mediaId: media.getId(), requesterId: 'intruder', requesterRoles: [] }),
    ).rejects.toThrow(MediaAccessDeniedError);
  });

  it('soft-deletes the media and publishes MediaDeleted', async () => {
    const media = MediaAttachment.create({
      taskId: 'task-1',
      uploadedBy: 'owner-1',
      originalFilename: 'clip.mp4',
      storageKey: 'videos/task-1/uuid.mp4',
      mimeType: 'video/mp4',
      fileSize: 2048,
    });
    const deps = buildDeps(media);
    const useCase = new DeleteMediaUseCase(deps.mediaRepository as never, deps.eventPublisher as never);

    await useCase.execute({ mediaId: media.getId(), requesterId: 'owner-1', requesterRoles: [] });

    expect(media.isDeleted()).toBe(true);
    expect(deps.mediaRepository.save).toHaveBeenCalledTimes(1);
    expect(deps.eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'MediaDeleted' }),
    );
  });
});
