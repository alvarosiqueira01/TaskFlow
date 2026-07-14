export interface NotificationResponse {
  id: string;
  taskId?: string;
  commentId?: string;
  type: 'ASSIGNMENT' | 'TASK_UPDATED' | 'MENTION';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}
