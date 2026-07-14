import { InvalidTaskDataError } from '../errors/invalid-task-data.error';

export const TASK_VISIBILITY_VALUES = ['PRIVATE', 'SHARED'] as const;

export type TaskVisibilityValue = (typeof TASK_VISIBILITY_VALUES)[number];

export class TaskVisibility {
  private constructor(private readonly value: TaskVisibilityValue) {}

  static create(value: string): TaskVisibility {
    if (!TASK_VISIBILITY_VALUES.includes(value as TaskVisibilityValue)) {
      throw new InvalidTaskDataError(
        `Invalid task visibility "${value}". Allowed values: ${TASK_VISIBILITY_VALUES.join(', ')}.`,
      );
    }
    return new TaskVisibility(value as TaskVisibilityValue);
  }

  static default(): TaskVisibility {
    return new TaskVisibility('PRIVATE');
  }

  isPrivate(): boolean {
    return this.value === 'PRIVATE';
  }

  toValue(): TaskVisibilityValue {
    return this.value;
  }

  equals(other: TaskVisibility): boolean {
    return this.value === other.value;
  }
}
