export const TaskStatusValues = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as const;

export type TaskStatusValue = (typeof TaskStatusValues)[number];

export class TaskStatus {
  private constructor(private readonly value: TaskStatusValue) {}

  static create(value: string): TaskStatus {
    if (!TaskStatusValues.includes(value as TaskStatusValue)) {
      throw new Error(`Invalid task status: ${value}`);
    }
    return new TaskStatus(value as TaskStatusValue);
  }

  static completed(): TaskStatus {
    return new TaskStatus('COMPLETED');
  }

  isCompleted(): boolean {
    return this.value === 'COMPLETED';
  }

  toString(): TaskStatusValue {
    return this.value;
  }

  equals(other: TaskStatus): boolean {
    return this.value === other.value;
  }
}
