import { computed, onMounted } from 'vue';
import { useReportsStore } from '../store/reports.store';

export function useReportsOverview() {
  const store = useReportsStore();

  onMounted(() => {
    store.loadStatusDistribution();
    store.loadCategoryDistribution();
  });

  return {
    statusDistribution: computed(() => store.statusDistribution),
    isLoadingStatusDistribution: computed(() => store.isLoadingStatusDistribution),
    statusDistributionError: computed(() => store.statusDistributionError),
    reloadStatusDistribution: store.loadStatusDistribution,

    categoryDistribution: computed(() => store.categoryDistribution),
    isLoadingCategoryDistribution: computed(() => store.isLoadingCategoryDistribution),
    categoryDistributionError: computed(() => store.categoryDistributionError),
    reloadCategoryDistribution: store.loadCategoryDistribution,
  };
}
