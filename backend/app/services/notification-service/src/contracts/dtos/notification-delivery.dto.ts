export interface NotificationDeliveryLogEntry {
  id: string;
  eventType: string;
  channel: string;
  recipientUserId: string;
  taskId?: string;
  commentId?: string;
  status: string;
  failureReason?: string;
  createdAt: string;
  sentAt?: string;
}
