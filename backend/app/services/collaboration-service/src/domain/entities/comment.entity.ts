import { randomUUID } from 'node:crypto';
import { EmptyCommentContentError } from '../exceptions/collaboration.exceptions.js';

export interface CommentProps {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  parentCommentId: string | null;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date | null;
}

export class Comment {
  private constructor(private props: CommentProps) {}

  static create(input: {
    taskId: string;
    userId: string;
    content: string;
    parentCommentId?: string | null;
    mentions?: string[];
  }): Comment {
    const trimmed = input.content?.trim() ?? '';
    if (trimmed.length === 0) {
      throw new EmptyCommentContentError();
    }

    return new Comment({
      id: randomUUID(),
      taskId: input.taskId,
      userId: input.userId,
      content: trimmed,
      parentCommentId: input.parentCommentId ?? null,
      mentions: Array.from(new Set(input.mentions ?? [])),
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  static restore(props: CommentProps): Comment {
    return new Comment(props);
  }

  get id(): string {
    return this.props.id;
  }

  get taskId(): string {
    return this.props.taskId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get content(): string {
    return this.props.content;
  }

  get parentCommentId(): string | null {
    return this.props.parentCommentId;
  }

  get mentions(): string[] {
    return [...this.props.mentions];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }

  hasMentions(): boolean {
    return this.props.mentions.length > 0;
  }

  toPrimitives(): CommentProps {
    return { ...this.props, mentions: [...this.props.mentions] };
  }
}
