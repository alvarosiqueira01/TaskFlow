import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { EmailMessage, EmailSenderRepository } from '../../domain/repositories/email-sender.repository.js';

export class SesEmailSender implements EmailSenderRepository {
  private readonly client: SESClient;

  constructor(
    private readonly senderAddress: string,
    region: string,
  ) {
    this.client = new SESClient({ region });
  }

  async send(message: EmailMessage): Promise<void> {
    await this.client.send(
      new SendEmailCommand({
        Source: this.senderAddress,
        Destination: { ToAddresses: [message.toAddress] },
        Message: {
          Subject: { Data: message.subject, Charset: 'UTF-8' },
          Body: { Text: { Data: message.body, Charset: 'UTF-8' } },
        },
      }),
    );
  }
}
