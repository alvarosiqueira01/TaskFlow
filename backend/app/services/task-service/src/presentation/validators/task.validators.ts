import { createTaskSchema } from '../../schemas/create-task.schema';
import { updateTaskSchema } from '../../schemas/update-task.schema';
import { listTasksQuerySchema } from '../../schemas/list-tasks-query.schema';
import { taskIdParamSchema } from '../../schemas/task-id-param.schema';
import { paginationQuerySchema } from '../../schemas/pagination-query.schema';
import { CreateTaskRequest } from '../../contracts/requests/create-task.request';
import { UpdateTaskRequest } from '../../contracts/requests/update-task.request';
import { HistoryQuery, ListTasksQuery } from '../../contracts/requests/list-tasks.query';

export function validateCreateTaskRequest(body: unknown): CreateTaskRequest {
  return createTaskSchema.parse(body);
}

export function validateUpdateTaskRequest(body: unknown): UpdateTaskRequest {
  return updateTaskSchema.parse(body);
}

export function validateListTasksQuery(query: unknown): ListTasksQuery {
  return listTasksQuerySchema.parse(query);
}

export function validateTaskIdParam(params: unknown): { id: string } {
  return taskIdParamSchema.parse(params);
}

export function validateHistoryQuery(query: unknown): HistoryQuery {
  return paginationQuerySchema.parse(query);
}
