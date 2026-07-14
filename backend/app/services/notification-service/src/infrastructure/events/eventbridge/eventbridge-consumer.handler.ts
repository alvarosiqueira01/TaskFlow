import { EventBridgeEvent } from 'aws-lambda';
import { loadEnvConfig } from '../../../config/env.js';
import { createDrizzleClient } from '../../database/drizzle/client.js';
import { DrizzleNotificationDeliveryRepository } from '../../repositories/drizzle-notification-delivery.repository.js';
import { UserDirectoryHttpClient } from '../../http/user-directory-http-client.js';
import { SesEmailSender } from '../../channels/ses-email-sender.js';
import { SnsPushSender } from '../../channels/sns-push-sender.js';

import { SendTaskAssignedNotificationUseCase } from '../../../application/use-cases/send-task-assigned-notification.use-case.js';
import { SendMentionNotificationUseCase } from '../../../application/use-cases/send-mention-notification.use-case.js';
import { SendTaskCompletedNotificationUseCase } from '../../../application/use-cases/send-task-completed-notification.use-case.js';

import { taskAssignedEventSchema } from '../../../events/consumed/task-assigned.event-schema.js';
import { mentionCreatedEventSchema } from '../../../events/consumed/mention-created.event-schema.js';
import { taskCompletedEventSchema } from '../../../events/consumed/task-completed.event-schema.js';
import { CONSUMED_EVENTS } from '../../../events/event-catalog.js';

// ---- Composition Root (event-driven Lambda) --------------------------------

const env = loadEnvConfig();
const db = createDrizzleClient(env.databaseUrl);

const notificationDeliveryRepository = new DrizzleNotificationDeliveryRepository(db);
const userDirectoryRepository = new UserDirectoryHttpClient({
  baseUrl: env.userServiceBaseUrl,
  internalToken: env.userServiceInternalToken,
});
const emailSenderRepository = new SesEmailSender(env.emailSenderAddress, env.awsRegion);
const pushSenderRepository = new SnsPushSender(env.awsRegion);

const sendTaskAssignedNotificationUseCase = new SendTaskAssignedNotificationUseCase(
  userDirectoryRepository,
  emailSenderRepository,
  pushSenderRepository,
  notificationDeliveryRepository,
);
const sendMentionNotificationUseCase = new SendMentionNotificationUseCase(
  userDirectoryRepository,
  emailSenderRepository,
  pushSenderRepository,
  notificationDeliveryRepository,
);
const sendTaskCompletedNotificationUseCase = new SendTaskCompletedNotificationUseCase(
  userDirectoryRepository,
  emailSenderRepository,
  notificationDeliveryRepository,
);

interface EventBridgeDetail {
  eventVersion: string;
  occurredAt: string;
  payload: unknown;
}

export const handler = async (event: EventBridgeEvent<string, EventBridgeDetail>): Promise<void> => {
  const detailType = event['detail-type'];
  const payload = event.detail.payload;

  switch (detailType) {
    case CONSUMED_EVENTS.TASK_ASSIGNED:
      await sendTaskAssignedNotificationUseCase.execute(taskAssignedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.MENTION_CREATED:
      await sendMentionNotificationUseCase.execute(mentionCreatedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.TASK_COMPLETED:
      await sendTaskCompletedNotificationUseCase.execute(taskCompletedEventSchema.parse(payload));
      break;
    default:
      // Ignore events this service does not subscribe to.
      break;
  }
};
