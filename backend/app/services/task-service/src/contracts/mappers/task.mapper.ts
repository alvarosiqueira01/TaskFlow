import { Task, TaskPrimitives } from '../../domain/entities/task.entity';
import { TaskHistoryEntry } from '../../domain/repositories/task-history.repository';
import { TaskDto } from '../dto/task.dto';
import { TaskHistoryDto } from '../dto/task-history.dto';

export class TaskMapper {
  static toDto(task: Task): TaskDto {
    return TaskMapper.primitivesToDto(task.toPrimitives());
  }

  static primitivesToDto(primitives: TaskPrimitives): TaskDto {
    return {
      id: primitives.id,
      ownerId: primitives.ownerId,
      title: primitives.title,
      description: primitives.description,
      categoryId: primitives.categoryId,
      status: primitives.status,
      priority: primitives.priority,
      visibility: primitives.visibility,
      dueDate: primitives.dueDate?.toISOString(),
      archived: primitives.archived,
      completedAt: primitives.completedAt?.toISOString(),
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt.toISOString(),
    };
  }

  static historyToDto(entry: TaskHistoryEntry): TaskHistoryDto {
    return {
      id: entry.id,
      taskId: entry.taskId,
      userId: entry.userId,
      action: entry.action,
      fieldName: entry.fieldName,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      createdAt: entry.createdAt.toISOString(),
    };
  }
}
