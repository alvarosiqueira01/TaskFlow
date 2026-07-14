import { EventBridgeClient, PutEventsCommand, PutEventsRequestEntry } from '@aws-sdk/client-eventbridge';
import { DomainEvent, EventPublisher } from '../../../domain/events/event-publisher.port.js';
import { EVENT_SOURCE } from '../../../config/constants.js';

export class EventBridgeEventPublisher implements EventPublisher {
  private readonly client: EventBridgeClient;

  constructor(
    private readonly eventBusName: string,
    region: string,
  ) {
    this.client = new EventBridgeClient({ region });
  }

  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    const entry: PutEventsRequestEntry = {
      EventBusName: this.eventBusName,
      Source: EVENT_SOURCE,
      DetailType: event.eventName,
      Detail: JSON.stringify({
        eventVersion: event.eventVersion,
        occurredAt: event.occurredAt.toISOString(),
        payload: event.payload,
      }),
    };

    await this.client.send(new PutEventsCommand({ Entries: [entry] }));
  }
}
