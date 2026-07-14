import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface CategoryCreatedPayload {
  categoryId: string;
  name: string;
  createdBy: string;
}

export class CategoryCreatedEvent extends BaseEvent<CategoryCreatedPayload> {
  constructor(payload: CategoryCreatedPayload, source: string, correlationId?: string) {
    super(EventType.CATEGORY_CREATED, source, payload, correlationId);
  }
}
