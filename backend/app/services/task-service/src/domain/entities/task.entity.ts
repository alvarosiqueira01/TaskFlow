import { randomUUID } from 'node:crypto';
import { TaskStatus, TaskStatusValue } from '../value-objects/task-status.value-object';
import { TaskPriority, TaskPriorityValue } from '../value-objects/task-priority.value-object';
import { TaskVisibility, TaskVisibilityValue } from '../value-objects/task-visibility.value-object';
import { InvalidTaskDataError } from '../errors/invalid-task-data.error';
import { TaskAccessDeniedError } from '../errors/task-access-denied.error';

const ADMIN_ROLE = 'ADMIN';
const TITLE_MAX_LENGTH = 200;

export interface CreateTaskProps {
  ownerId: string;
  title: string;
  description?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  visibility?: string;
  dueDate?: Date;
  archived?: boolean;
}

export interface UpdateTaskProps {
  title: string;
  description?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  visibility?: string;
  dueDate?: Date;
  archived?: boolean;
}

export interface ReconstituteTaskProps {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  categoryId?: string;
  status: string;
  priority: string;
  visibility: string;
  dueDate?: Date;
  archived: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskPrimitives {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  categoryId?: string;
  status: TaskStatusValue;
  priority: TaskPriorityValue;
  visibility: TaskVisibilityValue;
  dueDate?: Date;
  archived: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFieldChange {
  fieldName: string;
  oldValue: string | undefined;
  newValue: string | undefined;
}

export class Task {
  private constructor(
    private readonly id: string,
    private readonly ownerId: string,
    private title: string,
    private description: string | undefined,
    private categoryId: string | undefined,
    private status: TaskStatus,
    private priority: TaskPriority,
    private visibility: TaskVisibility,
    private dueDate: Date | undefined,
    private archived: boolean,
    private completedAt: Date | undefined,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(props: CreateTaskProps): Task {
    Task.assertTitle(props.title);

    const now = new Date();
    const status = props.status ? TaskStatus.create(props.status) : TaskStatus.default();

    return new Task(
      randomUUID(),
      props.ownerId,
      props.title.trim(),
      props.description,
      props.categoryId,
      status,
      props.priority ? TaskPriority.create(props.priority) : TaskPriority.default(),
      props.visibility ? TaskVisibility.create(props.visibility) : TaskVisibility.default(),
      props.dueDate,
      props.archived ?? false,
      status.isCompleted() ? now : undefined,
      now,
      now,
    );
  }

  static reconstitute(props: ReconstituteTaskProps): Task {
    return new Task(
      props.id,
      props.ownerId,
      props.title,
      props.description,
      props.categoryId,
      TaskStatus.create(props.status),
      TaskPriority.create(props.priority),
      TaskVisibility.create(props.visibility),
      props.dueDate,
      props.archived,
      props.completedAt,
      props.createdAt,
      props.updatedAt,
    );
  }

  private static assertTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new InvalidTaskDataError('Task title must not be empty.');
    }
    if (title.length > TITLE_MAX_LENGTH) {
      throw new InvalidTaskDataError(`Task title must not exceed ${TITLE_MAX_LENGTH} characters.`);
    }
  }

  ensureCanBeViewedBy(userId: string, roles: string[]): void {
    if (roles.includes(ADMIN_ROLE) || this.ownerId === userId) {
      return;
    }
    if (!this.visibility.isPrivate()) {
      return;
    }
    throw new TaskAccessDeniedError('You do not have permission to view this task.');
  }

  ensureCanBeModifiedBy(userId: string, roles: string[]): void {
    if (roles.includes(ADMIN_ROLE) || this.ownerId === userId) {
      return;
    }
    throw new TaskAccessDeniedError('Only the task owner or an administrator may modify this task.');
  }

  ensureCanBeDeletedBy(userId: string, roles: string[]): void {
    if (roles.includes(ADMIN_ROLE) || this.ownerId === userId) {
      return;
    }
    throw new TaskAccessDeniedError('Only the task owner or an administrator may delete this task.');
  }

  update(props: UpdateTaskProps): TaskFieldChange[] {
    Task.assertTitle(props.title);

    const before = this.toPrimitives();

    this.title = props.title.trim();
    this.description = props.description;
    this.categoryId = props.categoryId;
    this.dueDate = props.dueDate;
    this.archived = props.archived ?? this.archived;

    if (props.priority) {
      this.priority = TaskPriority.create(props.priority);
    }
    if (props.visibility) {
      this.visibility = TaskVisibility.create(props.visibility);
    }

    if (props.status) {
      const newStatus = TaskStatus.create(props.status);
      const wasCompleted = this.status.isCompleted();
      this.status = newStatus;

      if (newStatus.isCompleted() && !wasCompleted) {
        this.completedAt = new Date();
      } else if (!newStatus.isCompleted() && wasCompleted) {
        this.completedAt = undefined;
      }
    }

    this.updatedAt = new Date();

    return this.diff(before, this.toPrimitives());
  }

  private diff(before: TaskPrimitives, after: TaskPrimitives): TaskFieldChange[] {
    const trackedFields: (keyof TaskPrimitives)[] = [
      'title',
      'description',
      'categoryId',
      'status',
      'priority',
      'visibility',
      'dueDate',
      'archived',
    ];

    const changes: TaskFieldChange[] = [];
    for (const field of trackedFields) {
      const oldValue = Task.stringify(before[field]);
      const newValue = Task.stringify(after[field]);
      if (oldValue !== newValue) {
        changes.push({ fieldName: field, oldValue, newValue });
      }
    }
    return changes;
  }

  private static stringify(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return String(value);
  }

  getId(): string {
    return this.id;
  }

  getOwnerId(): string {
    return this.ownerId;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  toPrimitives(): TaskPrimitives {
    return {
      id: this.id,
      ownerId: this.ownerId,
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      status: this.status.toValue(),
      priority: this.priority.toValue(),
      visibility: this.visibility.toValue(),
      dueDate: this.dueDate,
      archived: this.archived,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
