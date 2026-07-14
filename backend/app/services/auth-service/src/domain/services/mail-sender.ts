export interface PasswordRecoveryEmailParams {
  to: string;
  recipientName?: string;
  resetUrl: string;
  expiresInMinutes: number;
}

/**
 * Domain-level port for outbound transactional email, needed to
 * complete the password recovery flow (FR-03). Implemented in
 * Infrastructure via Amazon SES.
 */
export interface MailSender {
  sendPasswordRecoveryEmail(params: PasswordRecoveryEmailParams): Promise<void>;
}
