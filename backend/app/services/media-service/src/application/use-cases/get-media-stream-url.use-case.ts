import { MediaAttachmentRepository } from '../../domain/repositories/media-attachment.repository';
import { MediaStreamingSigner } from '../../domain/repositories/media-streaming-signer.port';
import { TaskAccessVerifier } from '../../domain/repositories/task-access-verifier.port';
import { MediaNotFoundError } from '../../domain/errors/media-not-found.error';
import { MediaGoneError } from '../../domain/errors/media-gone.error';
import { STREAM_URL_EXPIRY_SECONDS } from '../../domain/constants/media.constants';
import { MediaStreamDto } from '../../contracts/dto/media-upload-url.dto';

export interface GetMediaStreamUrlCommand {
  mediaId: string;
  requesterId: string;
  bearerToken: string;
}

export class GetMediaStreamUrlUseCase {
  constructor(
    private readonly mediaRepository: MediaAttachmentRepository,
    private readonly signer: MediaStreamingSigner,
    private readonly taskAccessVerifier: TaskAccessVerifier,
  ) {}

  async execute(command: GetMediaStreamUrlCommand): Promise<MediaStreamDto> {
    const media = await this.mediaRepository.findById(command.mediaId, { includeDeleted: true });
    if (!media) {
      throw new MediaNotFoundError(command.mediaId);
    }
    if (media.isDeleted()) {
      throw new MediaGoneError(command.mediaId);
    }

    await this.taskAccessVerifier.assertAccess({
      taskId: media.getTaskId(),
      action: 'VIEW',
      bearerToken: command.bearerToken,
    });

    const signed = this.signer.generateSignedUrl(media.getStorageKey(), STREAM_URL_EXPIRY_SECONDS);

    return {
      streamUrl: signed.url,
      expiresAt: signed.expiresAt.toISOString(),
      contentType: media.getMimeType(),
      supportsRanges: true,
    };
  }
}
