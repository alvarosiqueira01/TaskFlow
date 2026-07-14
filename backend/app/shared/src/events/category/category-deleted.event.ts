import { BaseEvent } from '../base-event';
import { EventType } from '../event-types';

export interface CategoryDeletedPayload {
  categoryId: string;
  deletedBy: string;
}

export class CategoryDeletedEvent extends BaseEvent<CategoryDeletedPayload> {
  constructor(payload: CategoryDeletedPayload, source: string, correlationId?: string) {
    super(EventType.CATEGORY_DELETED, source, payload, correlationId);
  }
}
