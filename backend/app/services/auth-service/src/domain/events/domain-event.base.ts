/**
 * Base class for pure Domain Events, framework/technology agnostic.
 * The Application layer maps these into shared integration events
 * (see `events/published/*.mapper.ts`) before publishing to EventBridge.
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;

  protected constructor(public readonly eventName: string) {
    this.occurredAt = new Date();
  }
}
