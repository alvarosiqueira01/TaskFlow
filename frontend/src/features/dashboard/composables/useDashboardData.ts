import { computed, onMounted } from 'vue';
import { useDashboardStore } from '../store/dashboard.store';

/**
 * Composable used by DashboardPage to read state and trigger loads.
 * Follows the mandated flow: Component -> Composable -> Store -> Service.
 */
export function useDashboardData() {
  const store = useDashboardStore();

  const isInitialLoading = computed(
    () =>
      !store.metrics &&
      (store.isLoadingMetrics ||
        store.isLoadingStatusBreakdown ||
        store.isLoadingPriorityMix ||
        store.isLoadingUpcomingDeadlines ||
        store.isLoadingRecentActivity)
  );

  onMounted(() => {
    if (!store.metrics) {
      store.loadDashboard();
    }
  });

  return {
    metrics: computed(() => store.metrics),
    statusBreakdown: computed(() => store.statusBreakdown),
    priorityMix: computed(() => store.priorityMix),
    upcomingDeadlines: computed(() => store.upcomingDeadlines),
    recentActivity: computed(() => store.recentActivity),

    isLoadingMetrics: computed(() => store.isLoadingMetrics),
    isLoadingStatusBreakdown: computed(() => store.isLoadingStatusBreakdown),
    isLoadingPriorityMix: computed(() => store.isLoadingPriorityMix),
    isLoadingUpcomingDeadlines: computed(() => store.isLoadingUpcomingDeadlines),
    isLoadingRecentActivity: computed(() => store.isLoadingRecentActivity),

    errorMetrics: computed(() => store.errorMetrics),
    errorStatusBreakdown: computed(() => store.errorStatusBreakdown),
    errorPriorityMix: computed(() => store.errorPriorityMix),
    errorUpcomingDeadlines: computed(() => store.errorUpcomingDeadlines),
    errorRecentActivity: computed(() => store.errorRecentActivity),

    isInitialLoading,

    reloadMetrics: store.loadMetrics,
    reloadStatusBreakdown: store.loadStatusBreakdown,
    reloadPriorityMix: store.loadPriorityMix,
    reloadUpcomingDeadlines: store.loadUpcomingDeadlines,
    reloadRecentActivity: store.loadRecentActivity,
    refreshAll: store.loadDashboard,
  };
}
