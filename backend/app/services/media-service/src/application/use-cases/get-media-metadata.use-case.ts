import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { TaskAccessVerifier } from '../../domain/repositories/task-access-verifier.port';
import { MediaNotFoundError } from '../../domain/errors/media-not-found.error';
import { MediaAttachmentDto } from '../../contracts/dto/media-attachment.dto';
import { MediaMapper } from '../../contracts/mappers/media.mapper';

/** Spec extension (GET /media/{id}), per (A5)streaming-design.md §13 and FR-32. */
export interface GetMediaMetadataCommand {
  mediaId: string;
  requesterId: string;
  bearerToken: string;
}

export class GetMediaMetadataUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly taskAccessVerifier: TaskAccessVerifier,
  ) {}

  async execute(command: GetMediaMetadataCommand): Promise<MediaAttachmentDto> {
    const media = await this.mediaRepository.findById(command.mediaId);
    if (!media) {
      throw new MediaNotFoundError(command.mediaId);
    }

    await this.taskAccessVerifier.assertAccess({
      taskId: media.getTaskId(),
      action: 'VIEW',
      bearerToken: command.bearerToken,
    });

    return MediaMapper.toDto(media);
  }
}
