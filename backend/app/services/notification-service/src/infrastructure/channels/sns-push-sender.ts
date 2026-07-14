import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { PushMessage, PushSenderRepository } from '../../domain/repositories/push-sender.repository.js';

export class SnsPushSender implements PushSenderRepository {
  private readonly client: SNSClient;

  constructor(region: string) {
    this.client = new SNSClient({ region });
  }

  async send(message: PushMessage): Promise<void> {
    await this.client.send(
      new PublishCommand({
        TargetArn: message.deviceToken,
        Message: JSON.stringify({
          default: message.body,
          GCM: JSON.stringify({ notification: { title: message.title, body: message.body } }),
        }),
        MessageStructure: 'json',
      }),
    );
  }
}
