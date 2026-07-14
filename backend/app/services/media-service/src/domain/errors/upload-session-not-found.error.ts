import { DomainError } from './domain.error';

export class UploadSessionNotFoundError extends DomainError {
  constructor(uploadId: string) {
    super(`Upload session with id "${uploadId}" was not found or has expired.`);
  }
}
