import { MediaAttachment, MediaAttachmentPrimitives } from '../../domain/entities/media-attachment.entity';
import { MediaAttachmentDto } from '../dto/media-attachment.dto';

export class MediaMapper {
  static toDto(media: MediaAttachment): MediaAttachmentDto {
    return MediaMapper.primitivesToDto(media.toPrimitives());
  }

  static primitivesToDto(primitives: MediaAttachmentPrimitives): MediaAttachmentDto {
    return {
      id: primitives.id,
      taskId: primitives.taskId,
      uploadedBy: primitives.uploadedBy,
      mediaType: primitives.mediaType,
      originalFilename: primitives.originalFilename,
      storageKey: primitives.storageKey,
      mimeType: primitives.mimeType,
      fileSize: primitives.fileSize,
      durationSeconds: primitives.durationSeconds,
      width: primitives.width,
      height: primitives.height,
      thumbnailKey: primitives.thumbnailKey,
      checksum: primitives.checksum,
      uploadedAt: primitives.uploadedAt.toISOString(),
    };
  }
}
