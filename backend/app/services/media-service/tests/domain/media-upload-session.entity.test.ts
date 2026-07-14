import { MediaUploadSession } from '../../src/domain/entities/media-upload-session.entity';
import { MediaAccessDeniedError } from '../../src/domain/errors/media-access-denied.error';
import { InvalidMediaDataError } from '../../src/domain/errors/invalid-media-data.error';
import { MediaAlreadyConfirmedError } from '../../src/domain/errors/media-already-confirmed.error';

const baseProps = {
  taskId: 'task-1',
  uploadedBy: 'user-1',
  originalFilename: 'clip.mp4',
  contentType: 'video/mp4',
  fileSize: 4096,
  storageKey: 'videos/task-1/uuid.mp4',
  multipart: false,
};

describe('MediaUploadSession entity', () => {
  it('rejects confirmation by a different user', () => {
    const session = MediaUploadSession.create(baseProps);
    expect(() => session.ensureOwnedBy('other-user')).toThrow(MediaAccessDeniedError);
  });

  it('rejects a taskId that does not match the session', () => {
    const session = MediaUploadSession.create(baseProps);
    expect(() => session.ensureMatchesTask('different-task')).toThrow(InvalidMediaDataError);
  });

  it('prevents completing an already-completed session', () => {
    const session = MediaUploadSession.create(baseProps);
    session.markCompleted();
    expect(() => session.markCompleted()).toThrow(MediaAlreadyConfirmedError);
  });

  it('sets an expiration ten minutes after creation', () => {
    const session = MediaUploadSession.create(baseProps);
    const primitives = session.toPrimitives();
    const diffMs = primitives.expiresAt.getTime() - primitives.createdAt.getTime();
    expect(diffMs).toBe(600_000);
  });
});
