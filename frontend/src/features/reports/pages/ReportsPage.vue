<script setup lang="ts">
import { useReportsOverview } from '../composables/useReportsOverview';
import { useCompletionReport } from '../composables/useCompletionReport';
import ReportsActionBar from '../components/ReportsActionBar.vue';
import RawReportViewer from '../components/RawReportViewer.vue';
import StatusDistributionPanel from '../components/StatusDistributionPanel.vue';
import CategoryDistributionPanel from '../components/CategoryDistributionPanel.vue';
import type { DateRange } from '../types/report.types';

const {
  statusDistribution,
  isLoadingStatusDistribution,
  statusDistributionError,
  reloadStatusDistribution,
  categoryDistribution,
  isLoadingCategoryDistribution,
  categoryDistributionError,
  reloadCategoryDistribution,
} = useReportsOverview();

const {
  dateRange,
  activeReportKind,
  rawReport,
  isLoadingRawReport,
  rawReportError,
  isExportingCsv,
  exportCsvError,
  setReportKind,
  setDateRange,
  reloadRawReport,
  exportCsv,
} = useCompletionReport();

function handleUpdateRange(range: DateRange) {
  setDateRange(range.startDate, range.endDate);
}
</script>

<template>
  <div class="reports-page">
    <ReportsActionBar
      :date-range="dateRange"
      :exporting="isExportingCsv"
      :export-error="exportCsvError"
      @update-range="handleUpdateRange"
      @export="exportCsv"
    />

    <RawReportViewer
      :active-kind="activeReportKind"
      :data="rawReport"
      :loading="isLoadingRawReport"
      :error="rawReportError"
      @change-kind="setReportKind"
      @retry="reloadRawReport"
    />

    <div class="reports-page__grid">
      <StatusDistributionPanel
        :items="statusDistribution"
        :loading="isLoadingStatusDistribution"
        :error="statusDistributionError"
        @retry="reloadStatusDistribution"
      />

      <CategoryDistributionPanel
        :items="categoryDistribution"
        :loading="isLoadingCategoryDistribution"
        :error="categoryDistributionError"
        @retry="reloadCategoryDistribution"
      />
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.reports-page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .reports-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
