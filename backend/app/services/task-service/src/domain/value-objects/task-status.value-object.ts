import { InvalidTaskDataError } from '../errors/invalid-task-data.error';

export const TASK_STATUS_VALUES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as const;

export type TaskStatusValue = (typeof TASK_STATUS_VALUES)[number];

export class TaskStatus {
  private constructor(private readonly value: TaskStatusValue) {}

  static create(value: string): TaskStatus {
    if (!TASK_STATUS_VALUES.includes(value as TaskStatusValue)) {
      throw new InvalidTaskDataError(
        `Invalid task status "${value}". Allowed values: ${TASK_STATUS_VALUES.join(', ')}.`,
      );
    }
    return new TaskStatus(value as TaskStatusValue);
  }

  static default(): TaskStatus {
    return new TaskStatus('BACKLOG');
  }

  isCompleted(): boolean {
    return this.value === 'COMPLETED';
  }

  toValue(): TaskStatusValue {
    return this.value;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}
