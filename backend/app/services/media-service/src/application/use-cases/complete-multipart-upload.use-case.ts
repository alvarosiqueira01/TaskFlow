import { MediaAttachment } from '../../domain/entities/media-attachment.entity';
import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { MediaUploadSessionRepository } from '../../domain/repositories/media-upload-session.repository';
import { MediaStorageService } from '../../domain/repositories/media-storage.port';
import { EventPublisher } from '../../domain/events/event-publisher';
import { MediaUploadedEvent } from '../../domain/events/media-uploaded.event';
import { UploadSessionNotFoundError } from '../../domain/errors/upload-session-not-found.error';
import { InvalidMediaDataError } from '../../domain/errors/invalid-media-data.error';
import { CompleteMultipartUploadRequest } from '../../contracts/requests/multipart-upload.request';
import { MediaAttachmentDto } from '../../contracts/dto/media-attachment.dto';
import { MediaMapper } from '../../contracts/mappers/media.mapper';

export interface CompleteMultipartUploadCommand {
  uploadId: string;
  requesterId: string;
  data: CompleteMultipartUploadRequest;
}

export class CompleteMultipartUploadUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly sessionRepository: MediaUploadSessionRepository,
    private readonly storageService: MediaStorageService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CompleteMultipartUploadCommand): Promise<MediaAttachmentDto> {
    const session = await this.sessionRepository.findById(command.uploadId);
    if (!session) {
      throw new UploadSessionNotFoundError(command.uploadId);
    }

    session.ensureOwnedBy(command.requesterId);
    session.ensureMatchesTask(command.data.taskId);
    session.ensureNotCompleted();

    if (!session.isMultipart() || !session.getS3MultipartUploadId()) {
      throw new InvalidMediaDataError('Upload session was not initiated as a multipart upload.');
    }

    await this.storageService.completeMultipartUpload(
      session.getStorageKey(),
      session.getS3MultipartUploadId() as string,
      command.data.parts,
    );

    const media = MediaAttachment.create({
      taskId: session.getTaskId(),
      uploadedBy: command.requesterId,
      originalFilename: session.getOriginalFilename(),
      storageKey: session.getStorageKey(),
      mimeType: session.getContentType(),
      fileSize: session.getFileSize(),
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
