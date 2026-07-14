import { computed, ref } from 'vue';
import { useTaskStore } from '../store/taskStore';

export function useTaskSelection() {
  const taskStore = useTaskStore();
  const isDrawerOpen = ref(false);
  const isLoadingDetails = ref(false);

  const selectedTask = computed(() => taskStore.selectedTask);

  async function openTask(taskId: string) {
    taskStore.selectTask(taskId);
    isDrawerOpen.value = true;
    isLoadingDetails.value = true;
    try {
      await taskStore.fetchTaskDetails(taskId);
    } finally {
      isLoadingDetails.value = false;
    }
  }

  function closeDrawer() {
    isDrawerOpen.value = false;
    taskStore.selectTask(null);
  }

  return { selectedTask, isDrawerOpen, isLoadingDetails, openTask, closeDrawer };
}
