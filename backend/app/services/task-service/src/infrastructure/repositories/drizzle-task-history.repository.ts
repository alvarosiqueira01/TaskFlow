import { and, eq, gt, lt, or, asc, desc } from 'drizzle-orm';
import { DrizzleClient } from '../database/drizzle/client';
import { taskHistoryTable } from '../database/drizzle/schema';
import {
  TaskHistoryEntry,
  TaskHistoryRepository,
} from '../../domain/repositories/task-history.repository';
import { PaginatedResult, PaginationOptions } from '../../domain/repositories/task.repository';
import { decodeCursor, encodeCursor } from '../database/drizzle/cursor.util';

export class DrizzleTaskHistoryRepository implements TaskHistoryRepository {
  constructor(private readonly db: DrizzleClient) {}

  async append(entry: TaskHistoryEntry): Promise<void> {
    await this.db.insert(taskHistoryTable).values(entry);
  }

  async appendMany(entries: TaskHistoryEntry[]): Promise<void> {
    if (entries.length === 0) {
      return;
    }
    await this.db.insert(taskHistoryTable).values(entries);
  }

  async findByTaskId(taskId: string, pagination: PaginationOptions): Promise<PaginatedResult<TaskHistoryEntry>> {
    const conditions = [eq(taskHistoryTable.taskId, taskId)];

    if (pagination.cursor) {
      const decoded = decodeCursor(pagination.cursor);
      const comparableDate = new Date(decoded.value);
      conditions.push(
        or(
          lt(taskHistoryTable.createdAt, comparableDate),
          and(eq(taskHistoryTable.createdAt, comparableDate), gt(taskHistoryTable.id, decoded.id)),
        )!,
      );
    }

    const rows = await this.db
      .select()
      .from(taskHistoryTable)
      .where(and(...conditions))
      .orderBy(desc(taskHistoryTable.createdAt), asc(taskHistoryTable.id))
      .limit(pagination.limit + 1);

    const hasMore = rows.length > pagination.limit;
    const pageRows = hasMore ? rows.slice(0, pagination.limit) : rows;

    let nextCursor: string | null = null;
    if (hasMore) {
      const last = pageRows[pageRows.length - 1];
      nextCursor = encodeCursor(last.createdAt.toISOString(), last.id);
    }

    return {
      items: pageRows.map((row) => ({
        id: row.id,
        taskId: row.taskId,
        userId: row.userId,
        action: row.action,
        fieldName: row.fieldName ?? undefined,
        oldValue: row.oldValue ?? undefined,
        newValue: row.newValue ?? undefined,
        createdAt: row.createdAt,
      })),
      nextCursor,
      limit: pagination.limit,
    };
  }
}
