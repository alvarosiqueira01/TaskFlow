export interface TaskDto {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  categoryId?: string;
  status: string;
  priority: string;
  visibility: string;
  dueDate?: string;
  archived: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
