<script setup lang="ts" generic="TRow extends Record<string, unknown>">
/**
 * shared/components/DataTable.vue
 *
 * Generic table primitive per `UI-UX-guidelines.md` section 17:
 * pagination, sorting, filtering (via parent-controlled `rows`),
 * search (same), responsive collapse to a stacked card layout on
 * narrow viewports. Actions belong in the last column, achieved by the
 * caller supplying an `actions` column with a `#cell-actions` slot.
 *
 * This component owns rendering only; filtering/sorting/pagination
 * *requests* are emitted upward so the caller's feature service can
 * decide whether to sort/filter client-side or re-query the API
 * (most list endpoints in swagger.yaml are server-paginated).
 */
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import EmptyState from './EmptyState.vue';
import LoadingSkeleton from './LoadingSkeleton.vue';
import type { DataTableColumn, TableSortState } from '../types/table.types';

interface Props {
  rows: TRow[];
  columns: ReadonlyArray<DataTableColumn<TRow>>;
  rowKey: (row: TRow) => string | number;
  isLoading?: boolean;
  sort?: TableSortState | null;
  /** When provided, renders the pagination footer controlled by the caller (see `usePagination`). */
  page?: number;
  pageCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  sort: null,
  page: undefined,
  pageCount: undefined,
  emptyTitle: 'No results',
  emptyDescription: 'Try adjusting your filters or search terms.',
});

const emit = defineEmits<{
  'sort-change': [TableSortState];
  'page-change': [number];
  'row-click': [TRow];
}>();

function handleSort(column: DataTableColumn<TRow>): void {
  if (!column.sortable) return;

  const nextOrder = props.sort?.key === column.key && props.sort.order === 'asc' ? 'desc' : 'asc';
  emit('sort-change', { key: column.key, order: nextOrder });
}

function cellText(row: TRow, column: DataTableColumn<TRow>): string {
  const value = column.accessor ? column.accessor(row) : (row as Record<string, unknown>)[column.key];
  return value === null || value === undefined ? '—' : String(value);
}

function alignClass(align: DataTableColumn<TRow>['align']): string {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-200 bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-4 py-3 font-medium text-slate-500"
              :class="[alignClass(column.align), column.width]"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="inline-flex items-center gap-1 hover:text-slate-700 focus-visible:outline-none focus-visible:underline"
                @click="handleSort(column)"
              >
                {{ column.label }}
                <ChevronUp v-if="sort?.key === column.key && sort.order === 'asc'" class="h-3.5 w-3.5" aria-hidden="true" />
                <ChevronDown v-else-if="sort?.key === column.key && sort.order === 'desc'" class="h-3.5 w-3.5" aria-hidden="true" />
                <ChevronsUpDown v-else class="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100">
          <template v-if="isLoading">
            <tr v-for="skeletonRow in 5" :key="`skeleton-${skeletonRow}`">
              <td v-for="column in columns" :key="column.key" class="px-4 py-3">
                <LoadingSkeleton height="h-4" width="w-3/4" />
              </td>
            </tr>
          </template>

          <tr
            v-else
            v-for="row in rows"
            :key="rowKey(row)"
            class="cursor-pointer hover:bg-slate-50"
            @click="emit('row-click', row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-slate-700"
              :class="alignClass(column.align)"
            >
              <slot :name="`cell-${column.key}`" :row="row">
                {{ cellText(row, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-if="!isLoading && rows.length === 0"
      :title="emptyTitle"
      :description="emptyDescription"
    />

    <div
      v-if="!isLoading && rows.length > 0 && page !== undefined && pageCount !== undefined && pageCount > 1"
      class="flex items-center justify-between border-t border-slate-100 px-4 py-3"
    >
      <span class="text-xs text-slate-500">Page {{ page }} of {{ pageCount }}</span>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="emit('page-change', page - 1)"
        >
          <ChevronLeft class="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page >= pageCount"
          aria-label="Next page"
          @click="emit('page-change', page + 1)"
        >
          <ChevronRight class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>
