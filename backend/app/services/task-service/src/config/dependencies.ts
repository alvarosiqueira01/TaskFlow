import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { Env } from './env';
import { createDrizzleClient } from '../infrastructure/database/drizzle/client';
import { DrizzleTaskRepository } from '../infrastructure/repositories/drizzle-task.repository';
import { DrizzleTaskHistoryRepository } from '../infrastructure/repositories/drizzle-task-history.repository';
import { EventBridgeEventPublisher } from '../infrastructure/events/eventbridge/eventbridge-event-publisher';
import { JwtVerifier } from '../infrastructure/jwt/jwt-verifier';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';
import { GetTaskUseCase } from '../application/use-cases/get-task.use-case';
import { ListTasksUseCase } from '../application/use-cases/list-tasks.use-case';
import { GetTaskHistoryUseCase } from '../application/use-cases/get-task-history.use-case';
import { TaskController } from '../presentation/controllers/task.controller';

export interface AppDependencies {
  taskController: TaskController;
  jwtVerifier: JwtVerifier;
  dispose: () => Promise<void>;
}

export function buildDependencies(env: Env): AppDependencies {
  const { db, pool } = createDrizzleClient(env.DATABASE_URL);

  const taskRepository = new DrizzleTaskRepository(db);
  const taskHistoryRepository = new DrizzleTaskHistoryRepository(db);

  const eventBridgeClient = new EventBridgeClient({ region: env.AWS_REGION });
  const eventPublisher = new EventBridgeEventPublisher(eventBridgeClient, env.EVENT_BUS_NAME);

  const jwtVerifier = new JwtVerifier(env.JWT_SECRET);

  const createTaskUseCase = new CreateTaskUseCase(taskRepository, eventPublisher);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, taskHistoryRepository, eventPublisher);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, eventPublisher);
  const getTaskUseCase = new GetTaskUseCase(taskRepository);
  const listTasksUseCase = new ListTasksUseCase(taskRepository);
  const getTaskHistoryUseCase = new GetTaskHistoryUseCase(taskRepository, taskHistoryRepository);

  const taskController = new TaskController({
    createTaskUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    getTaskUseCase,
    listTasksUseCase,
    getTaskHistoryUseCase,
  });

  return {
    taskController,
    jwtVerifier,
    dispose: async () => {
      await pool.end();
    },
  };
}
