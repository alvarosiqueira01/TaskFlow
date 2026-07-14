import { NotificationDelivery } from '../entities/notification-delivery.entity.js';

export interface NotificationDeliveryRepository {
  save(notificationDelivery: NotificationDelivery): Promise<void>;
}
