import { EventBridgeEvent } from 'aws-lambda';
import { createDrizzleClient } from '../../database/drizzle/client.js';
import { DrizzleTaskReferenceRepository } from '../../repositories/drizzle-task-reference.repository.js';
import { ProjectTaskCreatedUseCase } from '../../../application/use-cases/project-task-created.use-case.js';
import { ProjectTaskUpdatedUseCase } from '../../../application/use-cases/project-task-updated.use-case.js';
import { taskCreatedEventSchema } from '../../../events/consumed/task-created.event-schema.js';
import { taskUpdatedEventSchema } from '../../../events/consumed/task-updated.event-schema.js';
import { CONSUMED_EVENTS } from '../../../events/event-catalog.js';
import { loadEnvConfig } from '../../../config/env.js';

const env = loadEnvConfig();
const db = createDrizzleClient(env.databaseUrl);
const taskReferenceRepository = new DrizzleTaskReferenceRepository(db);
const projectTaskCreated = new ProjectTaskCreatedUseCase(taskReferenceRepository);
const projectTaskUpdated = new ProjectTaskUpdatedUseCase(taskReferenceRepository);

interface EventBridgeDetail {
  eventVersion: string;
  occurredAt: string;
  payload: unknown;
}

export const handler = async (event: EventBridgeEvent<string, EventBridgeDetail>): Promise<void> => {
  const detailType = event['detail-type'];
  const payload = event.detail.payload;

  switch (detailType) {
    case CONSUMED_EVENTS.TASK_CREATED: {
      const parsed = taskCreatedEventSchema.parse(payload);
      await projectTaskCreated.execute(parsed);
      break;
    }
    case CONSUMED_EVENTS.TASK_UPDATED: {
      const parsed = taskUpdatedEventSchema.parse(payload);
      await projectTaskUpdated.execute(parsed);
      break;
    }
    default:
      // Ignore events this service does not subscribe to.
      break;
  }
};
