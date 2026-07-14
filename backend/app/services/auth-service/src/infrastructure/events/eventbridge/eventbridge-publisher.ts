import { EventBridgeClient, PutEventsCommand, type PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import type { BaseEvent, EventPublisher } from '@backend/shared';
import { EVENT_BUS } from '@backend/shared';

export interface EventBridgePublisherOptions {
  eventBusName: string;
  region: string;
}

/**
 * Concrete EventPublisher implementation, publishing domain integration
 * events to Amazon EventBridge. Implements the port defined in `@backend/shared`.
 */
export class EventBridgePublisher implements EventPublisher {
  private readonly client: EventBridgeClient;

  constructor(private readonly options: EventBridgePublisherOptions) {
    this.client = new EventBridgeClient({ region: options.region });
  }

  async publish<TPayload>(event: BaseEvent<TPayload>): Promise<void> {
    await this.publishBatch([event]);
  }

  async publishBatch<TPayload>(events: BaseEvent<TPayload>[]): Promise<void> {
    if (events.length === 0) return;

    const entries: PutEventsRequestEntry[] = events.map((event) => ({
      Source: `${EVENT_BUS.SOURCE_PREFIX}.${event.source}`,
      DetailType: event.eventType,
      Detail: JSON.stringify(event.toJSON()),
      EventBusName: this.options.eventBusName,
    }));

    await this.client.send(new PutEventsCommand({ Entries: entries }));
  }
}
