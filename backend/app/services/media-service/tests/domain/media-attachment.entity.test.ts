import { MediaAttachment } from '../../src/domain/entities/media-attachment.entity';
import { MediaAccessDeniedError } from '../../src/domain/errors/media-access-denied.error';
import { UnsupportedMediaTypeError } from '../../src/domain/errors/unsupported-media-type.error';

const baseProps = {
  taskId: 'task-1',
  uploadedBy: 'user-1',
  originalFilename: 'demo.mp4',
  storageKey: 'videos/task-1/uuid.mp4',
  mimeType: 'video/mp4',
  fileSize: 1024,
};

describe('MediaAttachment entity', () => {
  it('derives mediaType from the mimeType', () => {
    const media = MediaAttachment.create(baseProps);
    expect(media.toPrimitives().mediaType).toBe('VIDEO');
  });

  it('rejects unsupported mime types', () => {
    expect(() => MediaAttachment.create({ ...baseProps, mimeType: 'application/pdf' })).toThrow(
      UnsupportedMediaTypeError,
    );
  });

  it('allows the uploader to manage the media', () => {
    const media = MediaAttachment.create(baseProps);
    expect(() => media.ensureCanBeManagedBy('user-1', [])).not.toThrow();
  });

  it('allows an admin to manage media uploaded by someone else', () => {
    const media = MediaAttachment.create(baseProps);
    expect(() => media.ensureCanBeManagedBy('other-user', ['ADMIN'])).not.toThrow();
  });

  it('denies management to a non-uploader, non-admin user', () => {
    const media = MediaAttachment.create(baseProps);
    expect(() => media.ensureCanBeManagedBy('other-user', [])).toThrow(MediaAccessDeniedError);
  });

  it('marks the media as deleted without losing metadata', () => {
    const media = MediaAttachment.create(baseProps);
    media.softDelete();

    expect(media.isDeleted()).toBe(true);
    expect(media.toPrimitives().storageKey).toBe(baseProps.storageKey);
  });

  it('replaces storage details and resets the thumbnail', () => {
    const media = MediaAttachment.create(baseProps);
    const { previousStorageKey } = media.replace({
      storageKey: 'videos/task-1/new-uuid.mp4',
      mimeType: 'video/mp4',
      fileSize: 2048,
    });

    expect(previousStorageKey).toBe(baseProps.storageKey);
    expect(media.getStorageKey()).toBe('videos/task-1/new-uuid.mp4');
    expect(media.toPrimitives().thumbnailKey).toBeUndefined();
  });
});
