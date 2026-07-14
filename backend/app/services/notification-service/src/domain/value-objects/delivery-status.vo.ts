export const DeliveryStatusValues = ['PENDING', 'SENT', 'FAILED'] as const;

export type DeliveryStatusValue = (typeof DeliveryStatusValues)[number];

export class DeliveryStatus {
  private constructor(private readonly value: DeliveryStatusValue) {}

  static create(value: string): DeliveryStatus {
    if (!DeliveryStatusValues.includes(value as DeliveryStatusValue)) {
      throw new Error(`Invalid delivery status: ${value}`);
    }
    return new DeliveryStatus(value as DeliveryStatusValue);
  }

  static pending(): DeliveryStatus {
    return new DeliveryStatus('PENDING');
  }

  static sent(): DeliveryStatus {
    return new DeliveryStatus('SENT');
  }

  static failed(): DeliveryStatus {
    return new DeliveryStatus('FAILED');
  }

  isFailed(): boolean {
    return this.value === 'FAILED';
  }

  toString(): DeliveryStatusValue {
    return this.value;
  }

  equals(other: DeliveryStatus): boolean {
    return this.value === other.value;
  }
}
