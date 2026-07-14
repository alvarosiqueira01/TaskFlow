/**
 * Local, eventually-consistent read projection of a Task, built from
 * TaskCreated / TaskUpdated domain events consumed via EventBridge.
 * Used to authorize and enrich Assignment/Comment/Notification operations
 * without a synchronous cross-service call to task-service.
 */
export interface TaskReferenceProps {
  id: string;
  ownerId: string;
  title: string;
  status: string;
  updatedAt: Date;
}

export class TaskReference {
  private constructor(private props: TaskReferenceProps) {}

  static create(props: TaskReferenceProps): TaskReference {
    return new TaskReference(props);
  }

  get id(): string {
    return this.props.id;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get title(): string {
    return this.props.title;
  }

  get status(): string {
    return this.props.status;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isOwnedBy(userId: string): boolean {
    return this.props.ownerId === userId;
  }

  toPrimitives(): TaskReferenceProps {
    return { ...this.props };
  }
}
