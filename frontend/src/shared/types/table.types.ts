/**
 * shared/types/table.types.ts
 *
 * Generic contracts for `DataTable`. Kept separate from
 * `pagination.types.ts` (which describes page/offset state) since
 * these describe column configuration and sort state instead.
 */

import type { SortOrder } from './common.types';

export interface DataTableColumn<TRow> {
  key: string;
  label: string;
  sortable?: boolean;
  /** Tailwind width utility (e.g. `w-32`), for columns that need a fixed width. */
  width?: string;
  align?: 'left' | 'center' | 'right';
  /** Plain-text accessor used for the default cell rendering when no `#cell-<key>` slot is provided. */
  accessor?: (row: TRow) => string | number | null | undefined;
}

export interface TableSortState {
  key: string;
  order: SortOrder;
}
