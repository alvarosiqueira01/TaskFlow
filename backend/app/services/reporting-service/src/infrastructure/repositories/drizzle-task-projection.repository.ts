import { and, eq, gte, isNotNull, isNull, lte, ne, sql } from 'drizzle-orm';
import {
  DashboardStats,
  TaskProjectionRepository,
  TaskReportFilter,
} from '../../domain/repositories/task-projection.repository.js';
import { TaskProjection } from '../../domain/entities/task-projection.entity.js';
import { TaskStatus } from '../../domain/value-objects/task-status.vo.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { taskProjectionsTable } from '../database/drizzle/schema.js';

function toEntity(row: typeof taskProjectionsTable.$inferSelect): TaskProjection {
  return TaskProjection.restore({
    id: row.id,
    ownerId: row.ownerId,
    categoryId: row.categoryId,
    title: row.title,
    status: TaskStatus.create(row.status),
    priority: row.priority,
    dueDate: row.dueDate,
    completedAt: row.completedAt,
    commentsCount: row.commentsCount,
    mediaCount: row.mediaCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class DrizzleTaskProjectionRepository implements TaskProjectionRepository {
  constructor(private readonly db: DrizzleClient) {}

  async upsert(taskProjection: TaskProjection): Promise<void> {
    const primitives = taskProjection.toPrimitives();
    await this.db
      .insert(taskProjectionsTable)
      .values({
        id: primitives.id,
        ownerId: primitives.ownerId,
        categoryId: primitives.categoryId,
        title: primitives.title,
        status: primitives.status.toString(),
        priority: primitives.priority,
        dueDate: primitives.dueDate,
        completedAt: primitives.completedAt,
        commentsCount: primitives.commentsCount,
        mediaCount: primitives.mediaCount,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: taskProjectionsTable.id,
        set: {
          ownerId: primitives.ownerId,
          categoryId: primitives.categoryId,
          title: primitives.title,
          status: primitives.status.toString(),
          priority: primitives.priority,
          dueDate: primitives.dueDate,
          completedAt: primitives.completedAt,
          commentsCount: primitives.commentsCount,
          mediaCount: primitives.mediaCount,
          updatedAt: primitives.updatedAt,
        },
      });
  }

  async findById(taskId: string): Promise<TaskProjection | null> {
    const rows = await this.db
      .select()
      .from(taskProjectionsTable)
      .where(eq(taskProjectionsTable.id, taskId))
      .limit(1);

    if (rows.length === 0) return null;
    return toEntity(rows[0]);
  }

  async incrementCommentsCount(taskId: string): Promise<void> {
    await this.db
      .update(taskProjectionsTable)
      .set({ commentsCount: sql`${taskProjectionsTable.commentsCount} + 1` })
      .where(eq(taskProjectionsTable.id, taskId));
  }

  async incrementMediaCount(taskId: string): Promise<void> {
    await this.db
      .update(taskProjectionsTable)
      .set({ mediaCount: sql`${taskProjectionsTable.mediaCount} + 1` })
      .where(eq(taskProjectionsTable.id, taskId));
  }

  async decrementMediaCount(taskId: string): Promise<void> {
    await this.db
      .update(taskProjectionsTable)
      .set({ mediaCount: sql`GREATEST(${taskProjectionsTable.mediaCount} - 1, 0)` })
      .where(eq(taskProjectionsTable.id, taskId));
  }

  async findCompleted(filter: TaskReportFilter & { startDate?: Date; endDate?: Date }): Promise<TaskProjection[]> {
    const conditions = [eq(taskProjectionsTable.status, 'COMPLETED')];

    if (filter.ownerId) conditions.push(eq(taskProjectionsTable.ownerId, filter.ownerId));
    if (filter.startDate) conditions.push(gte(taskProjectionsTable.completedAt, filter.startDate));
    if (filter.endDate) conditions.push(lte(taskProjectionsTable.completedAt, filter.endDate));

    const rows = await this.db
      .select()
      .from(taskProjectionsTable)
      .where(and(...conditions));

    return rows.map(toEntity);
  }

  async findPending(filter: TaskReportFilter): Promise<TaskProjection[]> {
    const conditions = [ne(taskProjectionsTable.status, 'COMPLETED')];
    if (filter.ownerId) conditions.push(eq(taskProjectionsTable.ownerId, filter.ownerId));

    const rows = await this.db
      .select()
      .from(taskProjectionsTable)
      .where(and(...conditions));

    return rows.map(toEntity);
  }

  async getDashboardStats(filter: TaskReportFilter): Promise<DashboardStats> {
    const baseCondition = filter.ownerId ? eq(taskProjectionsTable.ownerId, filter.ownerId) : undefined;

    const totalRows = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(taskProjectionsTable)
      .where(baseCondition);

    const completedRows = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(taskProjectionsTable)
      .where(baseCondition ? and(baseCondition, eq(taskProjectionsTable.status, 'COMPLETED')) : eq(taskProjectionsTable.status, 'COMPLETED'));

    const pendingRows = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(taskProjectionsTable)
      .where(baseCondition ? and(baseCondition, ne(taskProjectionsTable.status, 'COMPLETED')) : ne(taskProjectionsTable.status, 'COMPLETED'));

    const overdueConditions = [
      ne(taskProjectionsTable.status, 'COMPLETED'),
      isNotNull(taskProjectionsTable.dueDate),
      lte(taskProjectionsTable.dueDate, new Date()),
    ];
    if (baseCondition) overdueConditions.push(baseCondition);

    const overdueRows = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(taskProjectionsTable)
      .where(and(...overdueConditions));

    return {
      totalTasks: totalRows[0]?.count ?? 0,
      completedTasks: completedRows[0]?.count ?? 0,
      pendingTasks: pendingRows[0]?.count ?? 0,
      overdueTasks: overdueRows[0]?.count ?? 0,
    };
  }
}
