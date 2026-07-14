import { and, eq, gt, ilike, lt, or, asc, desc } from 'drizzle-orm';
import { DrizzleClient } from '../database/drizzle/client';
import { tasksTable } from '../database/drizzle/schema';
import {
  PaginatedResult,
  PaginationOptions,
  TaskFilter,
  TaskRepository,
  TaskSort,
} from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskPersistenceMapper } from './mappers/task-persistence.mapper';
import { cursorValueToComparable, decodeCursor, encodeCursor } from '../database/drizzle/cursor.util';

const SORT_COLUMN_MAP = {
  createdAt: tasksTable.createdAt,
  updatedAt: tasksTable.updatedAt,
  dueDate: tasksTable.dueDate,
  priority: tasksTable.priority,
  status: tasksTable.status,
} as const;

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(task: Task): Promise<void> {
    const row = TaskPersistenceMapper.toPersistence(task);

    await this.db
      .insert(tasksTable)
      .values(row)
      .onConflictDoUpdate({
        target: tasksTable.id,
        set: {
          title: row.title,
          description: row.description,
          categoryId: row.categoryId,
          status: row.status,
          priority: row.priority,
          visibility: row.visibility,
          dueDate: row.dueDate,
          archived: row.archived,
          completedAt: row.completedAt,
          updatedAt: row.updatedAt,
        },
      });
  }

  async findById(id: string): Promise<Task | null> {
    const rows = await this.db.select().from(tasksTable).where(eq(tasksTable.id, id)).limit(1);
    if (rows.length === 0) {
      return null;
    }
    return TaskPersistenceMapper.toDomain(rows[0]);
  }

  async findMany(filter: TaskFilter, sort: TaskSort, pagination: PaginationOptions): Promise<PaginatedResult<Task>> {
    const conditions = [];

    if (filter.ownerId) {
      conditions.push(eq(tasksTable.ownerId, filter.ownerId));
    }
    if (filter.status) {
      conditions.push(eq(tasksTable.status, filter.status));
    }
    if (filter.priority) {
      conditions.push(eq(tasksTable.priority, filter.priority));
    }
    if (filter.categoryId) {
      conditions.push(eq(tasksTable.categoryId, filter.categoryId));
    }
    if (filter.search) {
      const term = `%${filter.search}%`;
      conditions.push(or(ilike(tasksTable.title, term), ilike(tasksTable.description, term)));
    }

    const sortColumn = SORT_COLUMN_MAP[sort.field];
    const compareOp = sort.order === 'asc' ? gt : lt;

    if (pagination.cursor) {
      const decoded = decodeCursor(pagination.cursor);
      const comparableValue = cursorValueToComparable(sort.field, decoded.value);

      conditions.push(
        or(
          compareOp(sortColumn, comparableValue as never),
          and(eq(sortColumn, comparableValue as never), compareOp(tasksTable.id, decoded.id)),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderFns =
      sort.order === 'asc'
        ? [asc(sortColumn), asc(tasksTable.id)]
        : [desc(sortColumn), desc(tasksTable.id)];

    const rows = await this.db
      .select()
      .from(tasksTable)
      .where(whereClause)
      .orderBy(...orderFns)
      .limit(pagination.limit + 1);

    const hasMore = rows.length > pagination.limit;
    const pageRows = hasMore ? rows.slice(0, pagination.limit) : rows;

    let nextCursor: string | null = null;
    if (hasMore) {
      const lastRow = pageRows[pageRows.length - 1];
      const rawValue = DrizzleTaskRepository.extractSortValue(lastRow, sort.field);
      nextCursor = encodeCursor(rawValue, lastRow.id);
    }

    return {
      items: pageRows.map((row) => TaskPersistenceMapper.toDomain(row)),
      nextCursor,
      limit: pagination.limit,
    };
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.id, id));
  }

  private static extractSortValue(row: typeof tasksTable.$inferSelect, field: keyof typeof SORT_COLUMN_MAP): string {
    const value = row[field as keyof typeof row];
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }
}
