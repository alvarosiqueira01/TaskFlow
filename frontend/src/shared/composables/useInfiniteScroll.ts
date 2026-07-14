/**
 * shared/composables/useInfiniteScroll.ts
 *
 * IntersectionObserver-based infinite scroll for cursor-paginated
 * feeds (Notifications list, Task comments, activity feed). The
 * caller supplies the `loadMore` callback that performs the actual
 * feature API request using the endpoint's `nextCursor`.
 */

import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

export interface UseInfiniteScrollOptions {
  /** Whether more pages are available. When `false`, the observer stops triggering `loadMore`. */
  hasMore: Ref<boolean>;
  /** Prevents overlapping requests while a page is already loading. */
  isLoading: Ref<boolean>;
  /** Called when the sentinel element becomes visible and another page should be fetched. */
  loadMore: () => void | Promise<void>;
  /** Root margin passed to `IntersectionObserver`, to start loading slightly before the sentinel is visible. */
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  loadMore,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  function disconnect(): void {
    observer?.disconnect();
    observer = null;
  }

  function observe(element: HTMLElement): void {
    disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible && hasMore.value && !isLoading.value) {
          void loadMore();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
  }

  watch(sentinelRef, (element) => {
    if (element) {
      observe(element);
    } else {
      disconnect();
    }
  });

  onBeforeUnmount(disconnect);

  return { sentinelRef };
}
