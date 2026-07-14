import { InvalidTaskDataError } from '../errors/invalid-task-data.error';

export const TASK_PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export type TaskPriorityValue = (typeof TASK_PRIORITY_VALUES)[number];

export class TaskPriority {
  private constructor(private readonly value: TaskPriorityValue) {}

  static create(value: string): TaskPriority {
    if (!TASK_PRIORITY_VALUES.includes(value as TaskPriorityValue)) {
      throw new InvalidTaskDataError(
        `Invalid task priority "${value}". Allowed values: ${TASK_PRIORITY_VALUES.join(', ')}.`,
      );
    }
    return new TaskPriority(value as TaskPriorityValue);
  }

  static default(): TaskPriority {
    return new TaskPriority('MEDIUM');
  }

  toValue(): TaskPriorityValue {
    return this.value;
  }

  equals(other: TaskPriority): boolean {
    return this.value === other.value;
  }
}
