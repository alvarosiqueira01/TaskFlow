import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { EventPublisher } from '../../domain/events/event-publisher';
import { MediaDeletedEvent } from '../../domain/events/media-deleted.event';
import { MediaNotFoundError } from '../../domain/errors/media-not-found.error';

/** Spec extension (DELETE /media/{id}), per (A5)streaming-design.md §13 and FR-33. */
export interface DeleteMediaCommand {
  mediaId: string;
  requesterId: string;
  requesterRoles: string[];
}

export class DeleteMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteMediaCommand): Promise<void> {
    const media = await this.mediaRepository.findById(command.mediaId);
    if (!media) {
      throw new MediaNotFoundError(command.mediaId);
    }

    media.ensureCanBeManagedBy(command.requesterId, command.requesterRoles);

    const storageKey = media.getStorageKey();
    media.softDelete();
    await this.mediaRepository.save(media);

    await this.eventPublisher.publish(
      new MediaDeletedEvent({
        mediaId: media.getId(),
        taskId: media.getTaskId(),
        deletedBy: command.requesterId,
        storageKey,
      }),
    );
  }
}
