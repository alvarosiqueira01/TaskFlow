import { randomUUID } from 'node:crypto';

export abstract class BaseEvent<TPayload = unknown> {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly occurredAt: string;
  public readonly source: string;
  public readonly correlationId?: string;
  public readonly payload: TPayload;

  protected constructor(eventType: string, source: string, payload: TPayload, correlationId?: string) {
    this.eventId = randomUUID();
    this.eventType = eventType;
    this.occurredAt = new Date().toISOString();
    this.source = source;
    this.correlationId = correlationId;
    this.payload = payload;
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      occurredAt: this.occurredAt,
      source: this.source,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}
