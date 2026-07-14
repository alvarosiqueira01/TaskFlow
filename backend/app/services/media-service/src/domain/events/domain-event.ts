export interface DomainEvent<TPayload extends object = any> {
  eventType: string;
  eventVersion: string;
  occurredAt: Date;
  source: string;
  payload: TPayload;
}
