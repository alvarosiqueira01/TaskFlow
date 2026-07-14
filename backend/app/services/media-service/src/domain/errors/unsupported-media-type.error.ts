import { DomainError } from './domain.error';

/** Maps to HTTP 415, per the Failure Handling table in (A5)streaming-design.md §15. */
export class UnsupportedMediaTypeError extends DomainError {
  constructor(mimeType: string) {
    super(`MIME type "${mimeType}" is not supported for media attachments.`);
  }
}
