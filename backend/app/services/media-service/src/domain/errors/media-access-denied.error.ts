import { DomainError } from './domain.error';

export class MediaAccessDeniedError extends DomainError {
  constructor(message = 'You do not have permission to perform this action on this media attachment.') {
    super(message);
  }
}
