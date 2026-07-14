export interface DomainEvent<TPayload = unknown> {
  eventName: string;
  eventVersion: string;
  occurredAt: Date;
  payload: TPayload;
}

/**
 * Port implemented by the Infrastructure layer (EventBridge adapter).
 * The Application layer depends only on this interface.
 */
export interface EventPublisher {
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
}
