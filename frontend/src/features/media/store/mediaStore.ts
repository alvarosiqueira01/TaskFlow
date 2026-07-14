import { defineStore } from 'pinia';
import { MediaService } from '../services/MediaService';
import type { MediaAttachment } from '../types/media.types';

interface TaskMediaBucket {
  attachments: MediaAttachment[];
  isLoading: boolean;
  error: string | null;
}

interface MediaStoreState {
  buckets: Record<string, TaskMediaBucket>;
}

function createEmptyBucket(): TaskMediaBucket {
  return { attachments: [], isLoading: false, error: null };
}

/**
 * Attachments are keyed by taskId. The API contract has no endpoint to
 * list media by task (only GET /media/{id} for a single item), so this
 * store is the client-side source of truth for "what's attached to this
 * task during the current session" — seeded via seedAttachments() and
 * kept in sync as uploads/replacements/deletions happen.
 */
export const useMediaStore = defineStore('media-attachments', {
  state: (): MediaStoreState => ({ buckets: {} }),

  getters: {
    bucketFor: (state) => (taskId: string) => state.buckets[taskId] ?? createEmptyBucket(),
    attachmentsFor: (state) => (taskId: string) => (state.buckets[taskId] ?? createEmptyBucket()).attachments,
  },

  actions: {
    ensureBucket(taskId: string) {
      if (!this.buckets[taskId]) this.buckets[taskId] = createEmptyBucket();
      return this.buckets[taskId];
    },

    seedAttachments(taskId: string, attachments: MediaAttachment[]) {
      const bucket = this.ensureBucket(taskId);
      const existingIds = new Set(bucket.attachments.map((a) => a.id));
      bucket.attachments = [...bucket.attachments, ...attachments.filter((a) => !existingIds.has(a.id))];
    },

    addAttachment(taskId: string, attachment: MediaAttachment) {
      const bucket = this.ensureBucket(taskId);
      bucket.attachments = [attachment, ...bucket.attachments.filter((a) => a.id !== attachment.id)];
    },

    replaceAttachment(taskId: string, attachment: MediaAttachment) {
      const bucket = this.ensureBucket(taskId);
      const index = bucket.attachments.findIndex((a) => a.id === attachment.id);
      if (index !== -1) bucket.attachments.splice(index, 1, attachment);
      else bucket.attachments = [attachment, ...bucket.attachments];
    },

    async refreshAttachment(taskId: string, mediaId: string) {
      const bucket = this.ensureBucket(taskId);
      const updated = await MediaService.getMedia(mediaId);
      const index = bucket.attachments.findIndex((a) => a.id === mediaId);
      if (index !== -1) bucket.attachments.splice(index, 1, updated);
      else bucket.attachments = [updated, ...bucket.attachments];
      return updated;
    },

    async removeAttachment(taskId: string, mediaId: string) {
      const bucket = this.ensureBucket(taskId);
      bucket.isLoading = true;
      bucket.error = null;
      try {
        await MediaService.deleteMedia(mediaId);
        bucket.attachments = bucket.attachments.filter((a) => a.id !== mediaId);
      } catch {
        bucket.error = 'Failed to delete attachment.';
      } finally {
        bucket.isLoading = false;
      }
    },
  },
});
