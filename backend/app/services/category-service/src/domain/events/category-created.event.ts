import { DomainEvent } from './event-publisher.port.js';

export interface CategoryCreatedPayload {
  categoryId: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export class CategoryCreatedEvent implements DomainEvent<CategoryCreatedPayload> {
  eventName = 'CategoryCreated' as const;
  eventVersion = '1.0' as const;
  occurredAt: Date;
  payload: CategoryCreatedPayload;

  constructor(payload: CategoryCreatedPayload) {
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
