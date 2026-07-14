export interface TaskHistoryDto {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}
