/**
 * Derived, not persisted: the API has no category-stats endpoint. Values
 * are `null` when the underlying /tasks response didn't include a
 * `total` (per the contract, that field is optional), so consumers must
 * render a neutral/unknown state rather than assuming 0.
 */
export interface CategoryStats {
  categoryId: string;
  totalTasks: number | null;
  completedTasks: number | null;
  completionPercentage: number | null;
}
