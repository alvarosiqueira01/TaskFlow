import { Task } from '../../../domain/entities/task.entity';
import { tasksTable } from '../../database/drizzle/schema';

type TaskRow = typeof tasksTable.$inferSelect;
type TaskInsert = typeof tasksTable.$inferInsert;

export class TaskPersistenceMapper {
  static toDomain(row: TaskRow): Task {
    return Task.reconstitute({
      id: row.id,
      ownerId: row.ownerId,
      title: row.title,
      description: row.description ?? undefined,
      categoryId: row.categoryId ?? undefined,
      status: row.status,
      priority: row.priority,
      visibility: row.visibility,
      dueDate: row.dueDate ?? undefined,
      archived: row.archived,
      completedAt: row.completedAt ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(task: Task): TaskInsert {
    const primitives = task.toPrimitives();
    return {
      id: primitives.id,
      ownerId: primitives.ownerId,
      title: primitives.title,
      description: primitives.description ?? null,
      categoryId: primitives.categoryId ?? null,
      status: primitives.status,
      priority: primitives.priority,
      visibility: primitives.visibility,
      dueDate: primitives.dueDate ?? null,
      archived: primitives.archived,
      completedAt: primitives.completedAt ?? null,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
