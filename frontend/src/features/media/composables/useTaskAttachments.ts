import { computed, onMounted } from 'vue';
import { useMediaStore } from '../store/mediaStore';
import type { MediaAttachment } from '../types/media.types';

export function useTaskAttachments(taskId: string, initialAttachments: MediaAttachment[] = []) {
  const store = useMediaStore();

  onMounted(() => {
    if (initialAttachments.length) store.seedAttachments(taskId, initialAttachments);
  });

  const attachments = computed(() => store.attachmentsFor(taskId));
  const isLoading = computed(() => store.bucketFor(taskId).isLoading);
  const error = computed(() => store.bucketFor(taskId).error);

  function addAttachment(attachment: MediaAttachment) {
    store.addAttachment(taskId, attachment);
  }

  function replaceAttachment(attachment: MediaAttachment) {
    store.replaceAttachment(taskId, attachment);
  }

  async function removeAttachment(mediaId: string) {
    await store.removeAttachment(taskId, mediaId);
  }

  return { attachments, isLoading, error, addAttachment, replaceAttachment, removeAttachment };
}
