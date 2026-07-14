export class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidDateRangeError extends DomainException {
  constructor() {
    super('startDate must not be after endDate', 'INVALID_DATE_RANGE');
  }
}

export class TaskProjectionNotFoundError extends DomainException {
  constructor(taskId: string) {
    super(`Task projection ${taskId} was not found`, 'TASK_PROJECTION_NOT_FOUND');
  }
}
