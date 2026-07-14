import { MediaUploadSessionRepository } from '../../domain/repositories/media-upload-session.repository';
import { MediaStorageService } from '../../domain/repositories/media-storage.port';
import { UploadSessionNotFoundError } from '../../domain/errors/upload-session-not-found.error';
import { InvalidMediaDataError } from '../../domain/errors/invalid-media-data.error';
import { MULTIPART_PART_URL_EXPIRY_SECONDS } from '../../domain/constants/media.constants';
import { MultipartPartUrlDto } from '../../contracts/dto/media-upload-url.dto';

export interface GetMultipartPartUrlsCommand {
  uploadId: string;
  requesterId: string;
  parts: number;
}

export class GetMultipartPartUrlsUseCase {
  constructor(
    private readonly sessionRepository: MediaUploadSessionRepository,
    private readonly storageService: MediaStorageService,
  ) {}

  async execute(command: GetMultipartPartUrlsCommand): Promise<{ partUrls: MultipartPartUrlDto[] }> {
    const session = await this.sessionRepository.findById(command.uploadId);
    if (!session) {
      throw new UploadSessionNotFoundError(command.uploadId);
    }

    session.ensureOwnedBy(command.requesterId);
    session.ensureNotCompleted();

    if (!session.isMultipart() || !session.getS3MultipartUploadId()) {
      throw new InvalidMediaDataError('Upload session was not initiated as a multipart upload.');
    }

    const partUrls = await this.storageService.generateMultipartPartUrls(
      session.getStorageKey(),
      session.getS3MultipartUploadId() as string,
      command.parts,
      MULTIPART_PART_URL_EXPIRY_SECONDS,
    );

    return { partUrls };
  }
}
