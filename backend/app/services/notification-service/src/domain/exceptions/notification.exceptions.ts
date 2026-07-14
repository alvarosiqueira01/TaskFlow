export class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RecipientNotFoundError extends DomainException {
  constructor(userId: string) {
    super(`Recipient ${userId} was not found in the user directory`, 'RECIPIENT_NOT_FOUND');
  }
}

export class RecipientHasNoEmailError extends DomainException {
  constructor(userId: string) {
    super(`Recipient ${userId} has no email address on file`, 'RECIPIENT_HAS_NO_EMAIL');
  }
}

export class NotificationDeliveryFailedError extends DomainException {
  constructor(reason: string) {
    super(`Notification delivery failed: ${reason}`, 'NOTIFICATION_DELIVERY_FAILED');
  }
}
