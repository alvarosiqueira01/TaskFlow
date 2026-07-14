export interface EmailMessage {
  toAddress: string;
  subject: string;
  body: string;
}

/**
 * Port implemented by the Infrastructure layer (Amazon SES adapter).
 * Named as a repository-style port for consistency with the project's
 * existing external-integration contracts (e.g. UserDirectoryRepository).
 */
export interface EmailSenderRepository {
  send(message: EmailMessage): Promise<void>;
}
