import { computed, onMounted } from 'vue';
import { useReportsStore } from '../store/reports.store';
import type { ReportKind } from '../types/report.types';

export function useCompletionReport() {
  const store = useReportsStore();

  onMounted(() => {
    store.loadRawReport();
  });

  async function setReportKind(kind: ReportKind) {
    store.setActiveReportKind(kind);
    await store.loadRawReport();
  }

  async function setDateRange(startDate: string, endDate: string) {
    store.setDateRange({ startDate, endDate });
    if (store.activeReportKind === 'completed') {
      await store.loadRawReport();
    }
  }

  return {
    dateRange: computed(() => store.dateRange),
    activeReportKind: computed(() => store.activeReportKind),
    rawReport: computed(() => store.rawReport),
    isLoadingRawReport: computed(() => store.isLoadingRawReport),
    rawReportError: computed(() => store.rawReportError),

    isExportingCsv: computed(() => store.isExportingCsv),
    exportCsvError: computed(() => store.exportCsvError),

    setReportKind,
    setDateRange,
    reloadRawReport: store.loadRawReport,
    exportCsv: store.exportCompletedReportAsCsv,
  };
}
