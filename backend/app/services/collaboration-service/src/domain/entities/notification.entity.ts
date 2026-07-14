import { randomUUID } from 'node:crypto';
import { NotificationType } from '../value-objects/notification-type.vo.js';

export interface NotificationProps {
  id: string;
  userId: string;
  taskId: string | null;
  commentId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
}

export class Notification {
  private constructor(private props: NotificationProps) {}

  static create(input: {
    userId: string;
    taskId?: string | null;
    commentId?: string | null;
    type: NotificationType;
    title: string;
    message: string;
  }): Notification {
    return new Notification({
      id: randomUUID(),
      userId: input.userId,
      taskId: input.taskId ?? null,
      commentId: input.commentId ?? null,
      type: input.type,
      title: input.title,
      message: input.message,
      isRead: false,
      createdAt: new Date(),
      readAt: null,
    });
  }

  static restore(props: NotificationProps): Notification {
    return new Notification(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get taskId(): string | null {
    return this.props.taskId;
  }

  get commentId(): string | null {
    return this.props.commentId;
  }

  get type(): NotificationType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get message(): string {
    return this.props.message;
  }

  get isRead(): boolean {
    return this.props.isRead;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get readAt(): Date | null {
    return this.props.readAt;
  }

  markAsRead(): void {
    if (this.props.isRead) {
      return;
    }
    this.props.isRead = true;
    this.props.readAt = new Date();
  }

  belongsTo(userId: string): boolean {
    return this.props.userId === userId;
  }

  toPrimitives(): NotificationProps {
    return { ...this.props };
  }
}
