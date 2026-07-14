import { and, eq } from 'drizzle-orm';
import { AssignmentRepository } from '../../domain/repositories/assignment.repository.js';
import { Assignment } from '../../domain/entities/assignment.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { assignmentsTable } from '../database/drizzle/schema.js';

export class DrizzleAssignmentRepository implements AssignmentRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(assignment: Assignment): Promise<void> {
    const primitives = assignment.toPrimitives();
    await this.db
      .insert(assignmentsTable)
      .values({
        id: primitives.id,
        taskId: primitives.taskId,
        userId: primitives.userId,
        assignedBy: primitives.assignedBy,
        assignedAt: primitives.assignedAt,
      })
      .onConflictDoNothing({ target: assignmentsTable.id });
  }

  async findByTaskAndUser(taskId: string, userId: string): Promise<Assignment | null> {
    const rows = await this.db
      .select()
      .from(assignmentsTable)
      .where(and(eq(assignmentsTable.taskId, taskId), eq(assignmentsTable.userId, userId)))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return Assignment.restore(rows[0]);
  }

  async findByTaskId(taskId: string): Promise<Assignment[]> {
    const rows = await this.db.select().from(assignmentsTable).where(eq(assignmentsTable.taskId, taskId));
    return rows.map((row) => Assignment.restore(row));
  }

  async delete(taskId: string, userId: string): Promise<void> {
    await this.db
      .delete(assignmentsTable)
      .where(and(eq(assignmentsTable.taskId, taskId), eq(assignmentsTable.userId, userId)));
  }
}
