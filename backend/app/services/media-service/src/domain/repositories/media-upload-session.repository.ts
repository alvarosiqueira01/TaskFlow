import { MediaUploadSession } from '../entities/media-upload-session.entity';

export interface MediaUploadSessionRepository {
  save(session: MediaUploadSession): Promise<void>;
  findById(id: string): Promise<MediaUploadSession | null>;
}
