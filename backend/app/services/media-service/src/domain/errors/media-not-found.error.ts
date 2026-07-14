import { DomainError } from './domain.error';

export class MediaNotFoundError extends DomainError {
  constructor(mediaId: string) {
    super(`Media attachment with id "${mediaId}" was not found.`);
  }
}
