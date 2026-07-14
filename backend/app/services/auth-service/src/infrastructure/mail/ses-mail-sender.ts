import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import type { MailSender, PasswordRecoveryEmailParams } from '../../domain/services/mail-sender';

export interface SesMailSenderOptions {
  region: string;
  fromAddress: string;
}

export class SesMailSender implements MailSender {
  private readonly client: SESv2Client;

  constructor(private readonly options: SesMailSenderOptions) {
    this.client = new SESv2Client({ region: options.region });
  }

  async sendPasswordRecoveryEmail(params: PasswordRecoveryEmailParams): Promise<void> {
    const greeting = params.recipientName ? `Hi ${params.recipientName},` : 'Hi,';

    await this.client.send(
      new SendEmailCommand({
        FromEmailAddress: this.options.fromAddress,
        Destination: { ToAddresses: [params.to] },
        Content: {
          Simple: {
            Subject: { Data: 'Reset your Task Manager password' },
            Body: {
              Text: {
                Data: `${greeting}\n\nWe received a request to reset your password. This link expires in ${params.expiresInMinutes} minutes:\n\n${params.resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
              },
            },
          },
        },
      }),
    );
  }
}
