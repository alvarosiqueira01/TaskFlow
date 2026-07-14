import { EventBridgeEvent } from 'aws-lambda';
import { createDrizzleClient } from '../../database/drizzle/client.js';
import { DrizzleTaskProjectionRepository } from '../../repositories/drizzle-task-projection.repository.js';
import { DrizzleCategoryProjectionRepository } from '../../repositories/drizzle-category-projection.repository.js';
import { ProjectTaskCreatedUseCase } from '../../../application/use-cases/project-task-created.use-case.js';
import { ProjectTaskUpdatedUseCase } from '../../../application/use-cases/project-task-updated.use-case.js';
import { ProjectTaskCompletedUseCase } from '../../../application/use-cases/project-task-completed.use-case.js';
import { ProjectCategoryCreatedUseCase } from '../../../application/use-cases/project-category-created.use-case.js';
import { ProjectCommentCreatedUseCase } from '../../../application/use-cases/project-comment-created.use-case.js';
import { ProjectMediaUploadedUseCase } from '../../../application/use-cases/project-media-uploaded.use-case.js';
import { ProjectMediaDeletedUseCase } from '../../../application/use-cases/project-media-deleted.use-case.js';
import { taskCreatedEventSchema } from '../../../events/consumed/task-created.event-schema.js';
import { taskUpdatedEventSchema } from '../../../events/consumed/task-updated.event-schema.js';
import { taskCompletedEventSchema } from '../../../events/consumed/task-completed.event-schema.js';
import { categoryCreatedEventSchema } from '../../../events/consumed/category-created.event-schema.js';
import { commentCreatedEventSchema } from '../../../events/consumed/comment-created.event-schema.js';
import { mediaUploadedEventSchema } from '../../../events/consumed/media-uploaded.event-schema.js';
import { mediaDeletedEventSchema } from '../../../events/consumed/media-deleted.event-schema.js';
import { CONSUMED_EVENTS } from '../../../events/event-catalog.js';
import { loadEnvConfig } from '../../../config/env.js';

const env = loadEnvConfig();
const db = createDrizzleClient(env.databaseUrl);

const taskProjectionRepository = new DrizzleTaskProjectionRepository(db);
const categoryProjectionRepository = new DrizzleCategoryProjectionRepository(db);

const projectTaskCreated = new ProjectTaskCreatedUseCase(taskProjectionRepository);
const projectTaskUpdated = new ProjectTaskUpdatedUseCase(taskProjectionRepository);
const projectTaskCompleted = new ProjectTaskCompletedUseCase(taskProjectionRepository);
const projectCategoryCreated = new ProjectCategoryCreatedUseCase(categoryProjectionRepository);
const projectCommentCreated = new ProjectCommentCreatedUseCase(taskProjectionRepository);
const projectMediaUploaded = new ProjectMediaUploadedUseCase(taskProjectionRepository);
const projectMediaDeleted = new ProjectMediaDeletedUseCase(taskProjectionRepository);

interface EventBridgeDetail {
  eventVersion: string;
  occurredAt: string;
  payload: unknown;
}

export const handler = async (event: EventBridgeEvent<string, EventBridgeDetail>): Promise<void> => {
  const detailType = event['detail-type'];
  const payload = event.detail.payload;

  switch (detailType) {
    case CONSUMED_EVENTS.TASK_CREATED:
      await projectTaskCreated.execute(taskCreatedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.TASK_UPDATED:
      await projectTaskUpdated.execute(taskUpdatedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.TASK_COMPLETED:
      await projectTaskCompleted.execute(taskCompletedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.CATEGORY_CREATED:
      await projectCategoryCreated.execute(categoryCreatedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.COMMENT_CREATED:
      await projectCommentCreated.execute(commentCreatedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.MEDIA_UPLOADED:
      await projectMediaUploaded.execute(mediaUploadedEventSchema.parse(payload));
      break;
    case CONSUMED_EVENTS.MEDIA_DELETED:
      await projectMediaDeleted.execute(mediaDeletedEventSchema.parse(payload));
      break;
    default:
      // Ignore events this service does not subscribe to.
      break;
  }
};
