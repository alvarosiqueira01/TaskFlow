import type { BaseEvent } from './base-event';

export interface EventPublisher {
  publish<TPayload>(event: BaseEvent<TPayload>): Promise<void>;
  publishBatch<TPayload>(events: BaseEvent<TPayload>[]): Promise<void>;
}
