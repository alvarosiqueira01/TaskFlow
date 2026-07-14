<script setup lang="ts">
import { useDashboardData } from '../composables/useDashboardData';
import KpiCardGrid from '../components/KpiCardGrid.vue';
import TasksByStatusChart from '../components/TasksByStatusChart.vue';
import PriorityMixList from '../components/PriorityMixList.vue';
import UpcomingDeadlinesList from '../components/UpcomingDeadlinesList.vue';
import RecentActivityFeed from '../components/RecentActivityFeed.vue';

const {
  metrics,
  statusBreakdown,
  priorityMix,
  upcomingDeadlines,
  recentActivity,

  isLoadingMetrics,
  isLoadingStatusBreakdown,
  isLoadingPriorityMix,
  isLoadingUpcomingDeadlines,
  isLoadingRecentActivity,

  errorMetrics,
  errorStatusBreakdown,
  errorPriorityMix,
  errorUpcomingDeadlines,
  errorRecentActivity,

  reloadMetrics,
  reloadStatusBreakdown,
  reloadPriorityMix,
  reloadUpcomingDeadlines,
  reloadRecentActivity,
} = useDashboardData();
</script>

<template>
  <div class="dashboard-page">
    <KpiCardGrid
      :metrics="metrics"
      :loading="isLoadingMetrics"
      :error="errorMetrics"
      @retry="reloadMetrics"
    />

    <div class="dashboard-page__grid">
      <TasksByStatusChart
        class="dashboard-page__status-chart"
        :items="statusBreakdown"
        :loading="isLoadingStatusBreakdown"
        :error="errorStatusBreakdown"
        @retry="reloadStatusBreakdown"
      />

      <PriorityMixList
        class="dashboard-page__priority-mix"
        :items="priorityMix"
        :loading="isLoadingPriorityMix"
        :error="errorPriorityMix"
        @retry="reloadPriorityMix"
      />

      <UpcomingDeadlinesList
        class="dashboard-page__deadlines"
        :items="upcomingDeadlines"
        :loading="isLoadingUpcomingDeadlines"
        :error="errorUpcomingDeadlines"
        @retry="reloadUpcomingDeadlines"
      />

      <RecentActivityFeed
        class="dashboard-page__activity"
        :items="recentActivity"
        :loading="isLoadingRecentActivity"
        :error="errorRecentActivity"
        @retry="reloadRecentActivity"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.dashboard-page__grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-areas:
    'status priority'
    'deadlines activity';
  gap: 24px;
}

.dashboard-page__status-chart {
  grid-area: status;
}

.dashboard-page__priority-mix {
  grid-area: priority;
}

.dashboard-page__deadlines {
  grid-area: deadlines;
}

.dashboard-page__activity {
  grid-area: activity;
}

@media (max-width: 1024px) {
  .dashboard-page__grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'status'
      'priority'
      'deadlines'
      'activity';
  }
}
</style>
