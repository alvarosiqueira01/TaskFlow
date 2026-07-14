import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { dashboardService } from '../services/DashboardService';
import type { DashboardState } from '../types/dashboard.types';

function createInitialState(): DashboardState {
  return {
    metrics: null,
    statusBreakdown: [],
    priorityMix: [],
    upcomingDeadlines: [],
    recentActivity: [],

    isLoadingMetrics: false,
    isLoadingStatusBreakdown: false,
    isLoadingPriorityMix: false,
    isLoadingUpcomingDeadlines: false,
    isLoadingRecentActivity: false,

    errorMetrics: null,
    errorStatusBreakdown: null,
    errorPriorityMix: null,
    errorUpcomingDeadlines: null,
    errorRecentActivity: null,
  };
}

export const useDashboardStore = defineStore('dashboard', () => {
  const state = reactive<DashboardState>(createInitialState());

  async function loadMetrics() {
    state.isLoadingMetrics = true;
    state.errorMetrics = null;
    try {
      state.metrics = await dashboardService.getDashboardMetrics();
    } catch {
      state.errorMetrics = 'Failed to load dashboard metrics.';
    } finally {
      state.isLoadingMetrics = false;
    }
  }

  async function loadStatusBreakdown() {
    state.isLoadingStatusBreakdown = true;
    state.errorStatusBreakdown = null;
    try {
      state.statusBreakdown = await dashboardService.getStatusBreakdown();
    } catch {
      state.errorStatusBreakdown = 'Failed to load task status breakdown.';
    } finally {
      state.isLoadingStatusBreakdown = false;
    }
  }

  async function loadPriorityMix() {
    state.isLoadingPriorityMix = true;
    state.errorPriorityMix = null;
    try {
      state.priorityMix = await dashboardService.getPriorityMix();
    } catch {
      state.errorPriorityMix = 'Failed to load task priority mix.';
    } finally {
      state.isLoadingPriorityMix = false;
    }
  }

  async function loadUpcomingDeadlines() {
    state.isLoadingUpcomingDeadlines = true;
    state.errorUpcomingDeadlines = null;
    try {
      state.upcomingDeadlines = await dashboardService.getUpcomingDeadlines();
    } catch {
      state.errorUpcomingDeadlines = 'Failed to load upcoming deadlines.';
    } finally {
      state.isLoadingUpcomingDeadlines = false;
    }
  }

  async function loadRecentActivity() {
    state.isLoadingRecentActivity = true;
    state.errorRecentActivity = null;
    try {
      state.recentActivity = await dashboardService.getRecentActivity();
    } catch {
      state.errorRecentActivity = 'Failed to load recent activity.';
    } finally {
      state.isLoadingRecentActivity = false;
    }
  }

  /** Loads every dashboard widget in parallel. */
  async function loadDashboard() {
    await Promise.all([
      loadMetrics(),
      loadStatusBreakdown(),
      loadPriorityMix(),
      loadUpcomingDeadlines(),
      loadRecentActivity(),
    ]);
  }

  function resetDashboard() {
    Object.assign(state, createInitialState());
  }

  return {
    ...toRefs(state),
    loadMetrics,
    loadStatusBreakdown,
    loadPriorityMix,
    loadUpcomingDeadlines,
    loadRecentActivity,
    loadDashboard,
    resetDashboard,
  };
});
