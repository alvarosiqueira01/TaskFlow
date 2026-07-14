import { EventBridgeClient, PutEventsCommand, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { DomainEvent } from '../../../domain/events/domain-event';
import { EventPublisher } from '../../../domain/events/event-publisher';

export class EventBridgeEventPublisher implements EventPublisher {
  constructor(
    private readonly client: EventBridgeClient,
    private readonly eventBusName: string,
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.publishMany([event]);
  }

  async publishMany(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const entries: PutEventsRequestEntry[] = events.map((event) => ({
      EventBusName: this.eventBusName,
      Source: event.source,
      DetailType: event.eventType,
      Time: event.occurredAt,
      Detail: JSON.stringify({
        eventVersion: event.eventVersion,
        occurredAt: event.occurredAt.toISOString(),
        payload: event.payload,
      }),
    }));

    const batches: PutEventsRequestEntry[][] = [];
    for (let i = 0; i < entries.length; i += 10) {
      batches.push(entries.slice(i, i + 10));
    }

    for (const batch of batches) {
      const result = await this.client.send(new PutEventsCommand({ Entries: batch }));
      if (result.FailedEntryCount && result.FailedEntryCount > 0) {
        throw new Error(`Failed to publish ${result.FailedEntryCount} event(s) to EventBridge.`);
      }
    }
  }
}
