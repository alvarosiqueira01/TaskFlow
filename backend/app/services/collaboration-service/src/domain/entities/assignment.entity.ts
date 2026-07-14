import { randomUUID } from 'node:crypto';

export interface AssignmentProps {
  id: string;
  taskId: string;
  userId: string;
  assignedBy: string;
  assignedAt: Date;
}

export class Assignment {
  private constructor(private props: AssignmentProps) {}

  static create(input: { taskId: string; userId: string; assignedBy: string }): Assignment {
    return new Assignment({
      id: randomUUID(),
      taskId: input.taskId,
      userId: input.userId,
      assignedBy: input.assignedBy,
      assignedAt: new Date(),
    });
  }

  static restore(props: AssignmentProps): Assignment {
    return new Assignment(props);
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

  get assignedBy(): string {
    return this.props.assignedBy;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  toPrimitives(): AssignmentProps {
    return { ...this.props };
  }
}
