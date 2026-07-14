import { eq } from 'drizzle-orm';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { TaskReference } from '../../domain/entities/task-reference.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { taskReferencesTable } from '../database/drizzle/schema.js';

export class DrizzleTaskReferenceRepository implements TaskReferenceRepository {
  constructor(private readonly db: DrizzleClient) {}

  async upsert(taskReference: TaskReference): Promise<void> {
    const primitives = taskReference.toPrimitives();
    await this.db
      .insert(taskReferencesTable)
      .values(primitives)
      .onConflictDoUpdate({
        target: taskReferencesTable.id,
        set: {
          ownerId: primitives.ownerId,
          title: primitives.title,
          status: primitives.status,
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async findById(taskId: string): Promise<TaskReference | null> {
    const rows = await this.db
      .select()
      .from(taskReferencesTable)
      .where(eq(taskReferencesTable.id, taskId))
      .limit(1);

    if (rows.length === 0) return null;
    return TaskReference.create(rows[0]);
  }
}
