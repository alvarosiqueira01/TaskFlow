import { MediaAttachment } from '../entities/media-attachment.entity';

export interface FindMediaOptions {
  includeDeleted?: boolean;
}

export interface MediaAttachmentRepository {
  save(media: MediaAttachment): Promise<void>;
  findById(id: string, options?: FindMediaOptions): Promise<MediaAttachment | null>;
}
