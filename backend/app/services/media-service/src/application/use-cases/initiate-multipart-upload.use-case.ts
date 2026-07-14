import { MediaUploadSession } from '../../domain/entities/media-upload-session.entity';
import { MediaType } from '../../domain/value-objects/media-type.value-object';
import { MediaUploadSessionRepository } from '../../domain/repositories/media-upload-session.repository';
import { MediaStorageService } from '../../domain/repositories/media-storage.port';
import { TaskAccessVerifier } from '../../domain/repositories/task-access-verifier.port';
import { EventPublisher } from '../../domain/events/event-publisher';
import { MediaUploadRequestedEvent } from '../../domain/events/media-upload-requested.event';
import { MediaTooLargeError } from '../../domain/errors/media-too-large.error';
import { MAX_FILE_SIZE_BYTES } from '../../domain/constants/media.constants';
import { InitiateMultipartUploadRequest } from '../../contracts/requests/multipart-upload.request';
import { MultipartInitiateDto } from '../../contracts/dto/media-upload-url.dto';

export interface InitiateMultipartUploadCommand {
  requesterId: string;
  bearerToken: string;
  data: InitiateMultipartUploadRequest;
}

export class InitiateMultipartUploadUseCase {
  constructor(
    private readonly sessionRepository: MediaUploadSessionRepository,
    private readonly storageService: MediaStorageService,
    private readonly taskAccessVerifier: TaskAccessVerifier,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: InitiateMultipartUploadCommand): Promise<MultipartInitiateDto> {
    const { data } = command;

    if (data.fileSize > MAX_FILE_SIZE_BYTES) {
      throw new MediaTooLargeError(data.fileSize, MAX_FILE_SIZE_BYTES);
    }

    const mediaType = MediaType.fromMimeType(data.contentType);

    await this.taskAccessVerifier.assertAccess({
      taskId: data.taskId,
      action: 'MODIFY',
      bearerToken: command.bearerToken,
    });

    const storageKey = this.storageService.buildObjectKey(mediaType.toValue(), data.taskId, data.filename);
    const s3MultipartUploadId = await this.storageService.createMultipartUpload(storageKey, data.contentType);

    const session = MediaUploadSession.create({
      taskId: data.taskId,
      uploadedBy: command.requesterId,
      originalFilename: data.filename,
      contentType: data.contentType,
      fileSize: data.fileSize,
      storageKey,
      multipart: true,
      s3MultipartUploadId,
    });

    await this.sessionRepository.save(session);

    await this.eventPublisher.publish(
      new MediaUploadRequestedEvent({
        uploadId: session.getId(),
        taskId: data.taskId,
        uploadedBy: command.requesterId,
        storageKey,
        multipart: true,
      }),
    );

    return { uploadId: session.getId(), storageKey };
  }
}
