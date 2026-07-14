export interface TaskSummaryResponse {
  id: string;
  title: string;
  status: string;
  priority: string;
  categoryId?: string;
  dueDate?: string;
  completedAt?: string;
  commentsCount: number;
  mediaCount: number;
  createdAt: string;
  updatedAt: string;
}
