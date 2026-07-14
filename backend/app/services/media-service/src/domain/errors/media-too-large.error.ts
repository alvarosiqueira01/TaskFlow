import { DomainError } from './domain.error';

/** Maps to HTTP 413, per the Failure Handling table in (A5)streaming-design.md §15. */
export class MediaTooLargeError extends DomainError {
  constructor(fileSize: number, maxSize: number) {
    super(`File size ${fileSize} bytes exceeds the maximum allowed size of ${maxSize} bytes.`);
  }
}
