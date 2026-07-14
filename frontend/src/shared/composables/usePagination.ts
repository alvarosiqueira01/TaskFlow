/**
 * shared/composables/usePagination.ts
 *
 * Local pagination state for offset-based lists (`DataTable`, category
 * grids, notification lists before they're wired to an actual
 * cursor-paginated endpoint). For cursor-paginated feature endpoints
 * (`/tasks`, `/notifications`, `/tasks/{id}/comments`, ...) prefer
 * composing this with the feature's own service call using
 * `nextCursor` from `CursorPaginatedResponse`.
 */

import { computed, ref } from 'vue';
import type { PaginationChangeEvent, PaginationState } from '../types/pagination.types';

export function usePagination(initial: Partial<PaginationState> = {}) {
  const page = ref(initial.page ?? 1);
  const pageSize = ref(initial.pageSize ?? 20);
  const total = ref(initial.total ?? 0);

  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
  const hasPreviousPage = computed(() => page.value > 1);
  const hasNextPage = computed(() => page.value < pageCount.value);

  const offset = computed(() => (page.value - 1) * pageSize.value);

  function goToPage(targetPage: number): void {
    page.value = Math.min(Math.max(1, targetPage), pageCount.value);
  }

  function nextPage(): void {
    if (hasNextPage.value) page.value += 1;
  }

  function previousPage(): void {
    if (hasPreviousPage.value) page.value -= 1;
  }

  function setPageSize(size: number): void {
    pageSize.value = size;
    page.value = 1;
  }

  function setTotal(newTotal: number): void {
    total.value = newTotal;
  }

  function reset(): void {
    page.value = 1;
  }

  const state = computed<PaginationChangeEvent>(() => ({
    page: page.value,
    pageSize: pageSize.value,
  }));

  return {
    page,
    pageSize,
    total,
    pageCount,
    hasPreviousPage,
    hasNextPage,
    offset,
    state,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    setTotal,
    reset,
  };
}
