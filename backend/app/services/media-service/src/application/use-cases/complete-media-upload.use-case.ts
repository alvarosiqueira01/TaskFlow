import { MediaAttachment } from '../../domain/entities/media-attachment.entity';
import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { MediaUploadSessionRepository } from '../../domain/repositories/media-upload-session.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { MediaUploadedEvent } from '../../domain/events/media-uploaded.event';
import { UploadSessionNotFoundError } from '../../domain/errors/upload-session-not-found.error';
import { InvalidMediaDataError } from '../../domain/errors/invalid-media-data.error';
import { CompleteMediaUploadRequest } from '../../contracts/requests/complete-media-upload.request';
import { MediaAttachmentDto } from '../../contracts/dto/media-attachment.dto';
import { MediaMapper } from '../../contracts/mappers/media.mapper';

export interface CompleteMediaUploadCommand {
  requesterId: string;
  data: CompleteMediaUploadRequest;
}

export class CompleteMediaUploadUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly sessionRepository: MediaUploadSessionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CompleteMediaUploadCommand): Promise<MediaAttachmentDto> {
    const { data } = command;

    const session = await this.sessionRepository.findById(data.uploadId);
    if (!session) {
      throw new UploadSessionNotFoundError(data.uploadId);
    }

    session.ensureOwnedBy(command.requesterId);
    session.ensureMatchesTask(data.taskId);
    session.ensureNotCompleted();

    if (session.getStorageKey() !== data.storageKey) {
      throw new InvalidMediaDataError('The provided storageKey does not match the upload session.');
    }

    const media = MediaAttachment.create({
      taskId: data.taskId,
      uploadedBy: command.requesterId,
      originalFilename: session.getOriginalFilename(),
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      checksum: data.checksum,
      width: data.width,
      height: data.height,
      durationSeconds: data.duration,
    });

    await this.mediaRepository.save(media);

    session.markCompleted();
    await this.sessionRepository.save(session);

    const primitives = media.toPrimitives();
    await this.eventPublisher.publish(
      new MediaUploadedEvent({
        mediaId: primitives.id,
        taskId: primitives.taskId,
        uploadedBy: primitives.uploadedBy,
        mediaType: primitives.mediaType,
        storageKey: primitives.storageKey,
        mimeType: primitives.mimeType,
        fileSize: primitives.fileSize,
      }),
    );

    return MediaMapper.toDto(media);
  }
}
