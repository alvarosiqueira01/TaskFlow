/** Mirrors components.schemas.Notification's `type` enum. */
export type NotificationType = 'ASSIGNMENT' | 'TASK_UPDATED' | 'MENTION';

/** Mirrors components.schemas.Notification. */
export interface Notification {
  id: string;
  taskId?: string;
  commentId?: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

/** Mirrors an entry of components.schemas.ProblemDetails.errors[]. */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * UI-level grouping for the notification tabs. Not present in the API
 * contract — see the module notes on how each tab is derived client-side
 * from the existing `type` / `commentId` fields.
 */
export type NotificationTab = 'ALL' | 'MENTIONS' | 'ASSIGNMENTS' | 'COMMENTS';

export interface NotificationState {
  items: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  unreadCount: number;
  isLoadingUnreadCount: boolean;

  isMarkingAllRead: boolean;
  markAllReadError: string | null;

  /** IDs currently being marked as read, for per-item busy states. */
  markingReadIds: string[];
}
