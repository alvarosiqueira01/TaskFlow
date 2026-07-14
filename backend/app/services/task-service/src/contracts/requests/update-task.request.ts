export interface UpdateTaskRequest {
  title: string;
  description?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  visibility?: string;
  dueDate?: string;
  archived?: boolean;
}
