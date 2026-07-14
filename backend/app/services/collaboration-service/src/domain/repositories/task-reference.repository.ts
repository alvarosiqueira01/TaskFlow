import { TaskReference } from '../entities/task-reference.entity.js';

export interface TaskReferenceRepository {
  upsert(taskReference: TaskReference): Promise<void>;
  findById(taskId: string): Promise<TaskReference | null>;
}
