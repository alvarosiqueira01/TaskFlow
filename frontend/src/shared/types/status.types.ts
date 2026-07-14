/**
 * shared/types/status.types.ts
 *
 * Task status/priority literal unions (mirrored from swagger.yaml
 * `TaskStatus` / `TaskPriority` enums) plus the presentation mappings
 * (label + Tailwind color classes) defined in `UI-UX-guidelines.md`
 * section 7 ("Color System"). Kept in `shared/types` — rather than a
 * `tasks` feature — because `StatusBadge` / `PriorityBadge` are
 * generic, reusable presentation components consumed by the Dashboard,
 * Task List, Reports, and other features alike.
 */

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface StatusVisual {
  label: string;
  dotClass: string;
  textClass: string;
  bgClass: string;
}

/**
 * NOTE: the guidelines only define colors for Todo/In Progress/Review/
 * Completed/Archived. `BACKLOG` (present in swagger.yaml but not in the
 * guideline table) is mapped to the same neutral gray family as Todo,
 * as the closest documented equivalent.
 */
export const TASK_STATUS_VISUALS: Record<TaskStatus, StatusVisual> = {
  BACKLOG: {
    label: 'Backlog',
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
  },
  TODO: {
    label: 'To Do',
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
  },
  REVIEW: {
    label: 'Review',
    dotClass: 'bg-orange-500',
    textClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
  },
  COMPLETED: {
    label: 'Completed',
    dotClass: 'bg-green-500',
    textClass: 'text-green-700',
    bgClass: 'bg-green-50',
  },
};

export const TASK_PRIORITY_VISUALS: Record<TaskPriority, StatusVisual> = {
  LOW: {
    label: 'Low',
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
  },
  MEDIUM: {
    label: 'Medium',
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
  },
  HIGH: {
    label: 'High',
    dotClass: 'bg-orange-500',
    textClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
  },
  CRITICAL: {
    label: 'Critical',
    dotClass: 'bg-red-500',
    textClass: 'text-red-700',
    bgClass: 'bg-red-50',
  },
};

/** Archived is a task state surfaced only in reports/history, not `TaskStatus` itself. */
export const ARCHIVED_VISUAL: StatusVisual = {
  label: 'Archived',
  dotClass: 'bg-gray-600',
  textClass: 'text-gray-700',
  bgClass: 'bg-gray-100',
};
