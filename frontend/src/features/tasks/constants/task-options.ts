import type { TaskPriority, TaskStatus, TaskVisibility } from '../types/task.types';

export interface StatusOption {
  value: TaskStatus;
  label: string;
  color: string;
}

export interface PriorityOption {
  value: TaskPriority;
  label: string;
  color: string;
  icon: string;
}

export const TASK_STATUS_OPTIONS: StatusOption[] = [
  { value: 'BACKLOG', label: 'Backlog', color: 'neutral' },
  { value: 'TODO', label: 'To Do', color: 'primary' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'warning' },
  { value: 'REVIEW', label: 'Review', color: 'primary' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
];

export const TASK_PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'LOW', label: 'Low', color: 'neutral', icon: 'arrow-down' },
  { value: 'MEDIUM', label: 'Medium', color: 'primary', icon: 'minus' },
  { value: 'HIGH', label: 'High', color: 'warning', icon: 'arrow-up' },
  { value: 'CRITICAL', label: 'Critical', color: 'error', icon: 'alert-triangle' },
];

export const TASK_VISIBILITY_OPTIONS: { value: TaskVisibility; label: string }[] = [
  { value: 'PRIVATE', label: 'Private' },
  { value: 'SHARED', label: 'Shared' },
];

export const KANBAN_COLUMNS: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

export function getStatusOption(status: TaskStatus): StatusOption {
  return TASK_STATUS_OPTIONS.find((option) => option.value === status) ?? TASK_STATUS_OPTIONS[0];
}

export function getPriorityOption(priority: TaskPriority): PriorityOption {
  return TASK_PRIORITY_OPTIONS.find((option) => option.value === priority) ?? TASK_PRIORITY_OPTIONS[1];
}
