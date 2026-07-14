import { and, asc, eq, gt } from 'drizzle-orm';
import { CommentPage, CommentRepository } from '../../domain/repositories/comment.repository.js';
import { Comment } from '../../domain/entities/comment.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { commentsTable } from '../database/drizzle/schema.js';

function decodeCursor(cursor: string | null | undefined): Date | undefined {
  if (!cursor) return undefined;
  return new Date(Buffer.from(cursor, 'base64url').toString('utf-8'));
}

function encodeCursor(date: Date): string {
  return Buffer.from(date.toISOString(), 'utf-8').toString('base64url');
}

export class DrizzleCommentRepository implements CommentRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(comment: Comment): Promise<void> {
    const primitives = comment.toPrimitives();
    await this.db
      .insert(commentsTable)
      .values({
        id: primitives.id,
        taskId: primitives.taskId,
        userId: primitives.userId,
        content: primitives.content,
        parentCommentId: primitives.parentCommentId,
        mentions: primitives.mentions,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: commentsTable.id,
        set: {
          content: primitives.content,
          updatedAt: primitives.updatedAt ?? new Date(),
        },
      });
  }

  async findById(commentId: string): Promise<Comment | null> {
    const rows = await this.db.select().from(commentsTable).where(eq(commentsTable.id, commentId)).limit(1);
    if (rows.length === 0) return null;
    return Comment.restore({ ...rows[0], mentions: rows[0].mentions ?? [] });
  }

  async findByTaskId(taskId: string, limit: number, cursor?: string | null): Promise<CommentPage> {
    const afterDate = decodeCursor(cursor);

    const whereClause = afterDate
      ? and(eq(commentsTable.taskId, taskId), gt(commentsTable.createdAt, afterDate))
      : eq(commentsTable.taskId, taskId);

    const rows = await this.db
      .select()
      .from(commentsTable)
      .where(whereClause)
      .orderBy(asc(commentsTable.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;

    return {
      items: pageRows.map((row) => Comment.restore({ ...row, mentions: row.mentions ?? [] })),
      nextCursor: hasMore ? encodeCursor(pageRows[pageRows.length - 1].createdAt) : null,
    };
  }
}
