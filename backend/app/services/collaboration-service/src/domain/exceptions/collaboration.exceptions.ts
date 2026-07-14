export class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TaskNotFoundError extends DomainException {
  constructor(taskId: string) {
    super(`Task ${taskId} was not found`, 'TASK_NOT_FOUND');
  }
}

export class AssignmentNotFoundError extends DomainException {
  constructor(taskId: string, userId: string) {
    super(`Assignment for user ${userId} on task ${taskId} was not found`, 'ASSIGNMENT_NOT_FOUND');
  }
}

export class DuplicateAssignmentError extends DomainException {
  constructor(taskId: string, userId: string) {
    super(`User ${userId} is already assigned to task ${taskId}`, 'DUPLICATE_ASSIGNMENT');
  }
}

export class ForbiddenAssignmentError extends DomainException {
  constructor(message = 'You are not allowed to manage assignments for this task') {
    super(message, 'FORBIDDEN_ASSIGNMENT');
  }
}

export class EmptyCommentContentError extends DomainException {
  constructor() {
    super('Comment content must not be empty', 'EMPTY_COMMENT_CONTENT');
  }
}

export class CommentNotFoundError extends DomainException {
  constructor(commentId: string) {
    super(`Comment ${commentId} was not found`, 'COMMENT_NOT_FOUND');
  }
}

export class ParentCommentNotFoundError extends DomainException {
  constructor(parentCommentId: string) {
    super(`Parent comment ${parentCommentId} was not found`, 'PARENT_COMMENT_NOT_FOUND');
  }
}

export class NotificationNotFoundError extends DomainException {
  constructor(notificationId: string) {
    super(`Notification ${notificationId} was not found`, 'NOTIFICATION_NOT_FOUND');
  }
}

export class ForbiddenNotificationAccessError extends DomainException {
  constructor() {
    super('You are not allowed to access this notification', 'FORBIDDEN_NOTIFICATION_ACCESS');
  }
}
