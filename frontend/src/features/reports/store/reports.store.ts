import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { reportsService } from '../services/ReportsService';
import { convertJsonToCsv, downloadCsv } from '../composables/useCsvExport';
import { TASK_STATUS_VALUES, TASK_STATUS_LABELS } from '../types/report.types';
import type { ReportsState, DateRange, ReportKind } from '../types/report.types';

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function defaultDateRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function createInitialState(): ReportsState {
  return {
    statusDistribution: [],
    isLoadingStatusDistribution: false,
    statusDistributionError: null,

    categoryDistribution: [],
    isLoadingCategoryDistribution: false,
    categoryDistributionError: null,

    dateRange: defaultDateRange(),

    rawReport: null,
    activeReportKind: 'completed',
    isLoadingRawReport: false,
    rawReportError: null,

    isExportingCsv: false,
    exportCsvError: null,
  };
}

export const useReportsStore = defineStore('reports', () => {
  const state = reactive<ReportsState>(createInitialState());

  async function loadStatusDistribution() {
    state.isLoadingStatusDistribution = true;
    state.statusDistributionError = null;
    try {
      const counts = await Promise.all(
        TASK_STATUS_VALUES.map((status) => reportsService.getTaskCountByStatus(status))
      );
      state.statusDistribution = TASK_STATUS_VALUES.map((status, index) => ({
        status,
        label: TASK_STATUS_LABELS[status],
        count: counts[index],
      }));
    } catch {
      state.statusDistributionError = 'Failed to load status distribution.';
    } finally {
      state.isLoadingStatusDistribution = false;
    }
  }

  async function loadCategoryDistribution() {
    state.isLoadingCategoryDistribution = true;
    state.categoryDistributionError = null;
    try {
      const categories = await reportsService.listCategories();
      const counts = await Promise.all(
        categories.map((category) => reportsService.getTaskCountByCategory(category.id))
      );
      state.categoryDistribution = categories.map((category, index) => ({
        categoryId: category.id,
        categoryName: category.name,
        count: counts[index],
      }));
    } catch {
      state.categoryDistributionError = 'Failed to load category distribution.';
    } finally {
      state.isLoadingCategoryDistribution = false;
    }
  }

  function setDateRange(range: DateRange) {
    state.dateRange = range;
  }

  function setActiveReportKind(kind: ReportKind) {
    state.activeReportKind = kind;
  }

  async function loadRawReport() {
    state.isLoadingRawReport = true;
    state.rawReportError = null;
    try {
      state.rawReport =
        state.activeReportKind === 'completed'
          ? await reportsService.getCompletedTasksReport(state.dateRange.startDate, state.dateRange.endDate)
          : await reportsService.getPendingTasksReport();
    } catch {
      state.rawReportError =
        state.activeReportKind === 'completed'
          ? 'Failed to load the completed tasks report.'
          : 'Failed to load the pending tasks report.';
    } finally {
      state.isLoadingRawReport = false;
    }
  }

  async function exportCompletedReportAsCsv() {
    state.isExportingCsv = true;
    state.exportCsvError = null;
    try {
      const payload = await reportsService.getCompletedTasksReport(
        state.dateRange.startDate,
        state.dateRange.endDate
      );
      const csv = convertJsonToCsv(payload);
      downloadCsv(`completed-tasks-${state.dateRange.startDate}_to_${state.dateRange.endDate}.csv`, csv);
    } catch {
      state.exportCsvError = 'Failed to export the completed tasks report.';
    } finally {
      state.isExportingCsv = false;
    }
  }

  function resetReports() {
    Object.assign(state, createInitialState());
  }

  return {
    ...toRefs(state),
    loadStatusDistribution,
    loadCategoryDistribution,
    setDateRange,
    setActiveReportKind,
    loadRawReport,
    exportCompletedReportAsCsv,
    resetReports,
  };
});
