import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { MediaReplacedEvent } from '../../domain/events/media-replaced.event';
import { MediaNotFoundError } from '../../domain/errors/media-not-found.error';
import { ReplaceMediaRequest } from '../../contracts/requests/replace-media.request';
import { MediaAttachmentDto } from '../../contracts/dto/media-attachment.dto';
import { MediaMapper } from '../../contracts/mappers/media.mapper';

/** Spec extension (PUT /media/{id}), per (A5)streaming-design.md §13 "Replace". */
export interface ReplaceMediaCommand {
  mediaId: string;
  requesterId: string;
  requesterRoles: string[];
  data: ReplaceMediaRequest;
}

export class ReplaceMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ReplaceMediaCommand): Promise<MediaAttachmentDto> {
    const media = await this.mediaRepository.findById(command.mediaId);
    if (!media) {
      throw new MediaNotFoundError(command.mediaId);
    }

    media.ensureCanBeManagedBy(command.requesterId, command.requesterRoles);

    const { previousStorageKey } = media.replace({
      storageKey: command.data.storageKey,
      mimeType: command.data.mimeType,
      fileSize: command.data.fileSize,
      checksum: command.data.checksum,
      width: command.data.width,
      height: command.data.height,
      durationSeconds: command.data.duration,
    });

    await this.mediaRepository.save(media);

    await this.eventPublisher.publish(
      new MediaReplacedEvent({
        mediaId: media.getId(),
        taskId: media.getTaskId(),
        replacedBy: command.requesterId,
        previousStorageKey,
        newStorageKey: media.getStorageKey(),
      }),
    );

    return MediaMapper.toDto(media);
  }
}
