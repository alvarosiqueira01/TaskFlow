import { DomainError } from './domain.error';

/** Raised when metadata exists but the media object has already been deleted (HTTP 410). */
export class MediaGoneError extends DomainError {
  constructor(mediaId: string) {
    super(`Media attachment with id "${mediaId}" has been deleted.`);
  }
}
