import { TaskStatus } from '../value-objects/task-status.vo.js';

/**
 * Local, eventually-consistent read projection of a Task, built from
 * TaskCreated / TaskUpdated / TaskCompleted / CommentCreated /
 * MediaUploaded / MediaDeleted domain events. Owned exclusively by the
 * Reporting bounded context; never written back to task-service.
 */
export interface TaskProjectionProps {
  id: string;
  ownerId: string;
  categoryId: string | null;
  title: string;
  status: TaskStatus;
  priority: string;
  dueDate: Date | null;
  completedAt: Date | null;
  commentsCount: number;
  mediaCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskProjection {
  private constructor(private props: TaskProjectionProps) {}

  static create(input: {
    id: string;
    ownerId: string;
    categoryId?: string | null;
    title: string;
    status: string;
    priority?: string;
    dueDate?: Date | null;
    createdAt: Date;
  }): TaskProjection {
    const status = TaskStatus.create(input.status);
    return new TaskProjection({
      id: input.id,
      ownerId: input.ownerId,
      categoryId: input.categoryId ?? null,
      title: input.title,
      status,
      priority: input.priority ?? 'MEDIUM',
      dueDate: input.dueDate ?? null,
      completedAt: status.isCompleted() ? input.createdAt : null,
      commentsCount: 0,
      mediaCount: 0,
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    });
  }

  static restore(props: TaskProjectionProps): TaskProjection {
    return new TaskProjection(props);
  }

  get id(): string {
    return this.props.id;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get dueDate(): Date | null {
    return this.props.dueDate;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  applyUpdate(input: {
    title?: string;
    status?: string;
    priority?: string;
    categoryId?: string | null;
    dueDate?: Date | null;
    updatedAt: Date;
  }): void {
    if (input.title !== undefined) this.props.title = input.title;
    if (input.status !== undefined) this.props.status = TaskStatus.create(input.status);
    if (input.priority !== undefined) this.props.priority = input.priority;
    if (input.categoryId !== undefined) this.props.categoryId = input.categoryId;
    if (input.dueDate !== undefined) this.props.dueDate = input.dueDate;
    this.props.updatedAt = input.updatedAt;
  }

  markCompleted(completedAt: Date): void {
    this.props.status = TaskStatus.completed();
    this.props.completedAt = completedAt;
    this.props.updatedAt = completedAt;
  }

  incrementCommentsCount(): void {
    this.props.commentsCount += 1;
  }

  incrementMediaCount(): void {
    this.props.mediaCount += 1;
  }

  decrementMediaCount(): void {
    this.props.mediaCount = Math.max(0, this.props.mediaCount - 1);
  }

  isOverdue(referenceDate: Date): boolean {
    if (!this.props.dueDate || this.props.status.isCompleted()) {
      return false;
    }
    return this.props.dueDate.getTime() < referenceDate.getTime();
  }

  toPrimitives(): TaskProjectionProps {
    return { ...this.props };
  }
}
