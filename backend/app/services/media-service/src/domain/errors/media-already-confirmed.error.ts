import { DomainError } from './domain.error';

/** Maps to HTTP 409, matching the /media/complete '409: Upload already confirmed' response. */
export class MediaAlreadyConfirmedError extends DomainError {
  constructor(uploadId: string) {
    super(`Upload session "${uploadId}" has already been confirmed.`);
  }
}
