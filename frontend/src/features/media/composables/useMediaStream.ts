import { ref } from 'vue';
import { MediaService } from '../services/MediaService';

/**
 * Streaming URLs must never be cached in application state (per the
 * UI/UX guidelines), so this composable holds the URL only in local,
 * component-scoped state, re-requesting it fresh each time playback
 * starts rather than persisting it in the Pinia store.
 */
export function useMediaStream() {
  const streamUrl = ref<string | null>(null);
  const contentType = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const hasRequested = ref(false);

  async function requestStream(mediaId: string) {
    if (hasRequested.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await MediaService.getMediaStreamUrl(mediaId);
      streamUrl.value = response.streamUrl;
      contentType.value = response.contentType;
      hasRequested.value = true;
    } catch {
      error.value = 'Failed to load media stream. It may have expired.';
    } finally {
      isLoading.value = false;
    }
  }

  return { streamUrl, contentType, isLoading, error, hasRequested, requestStream };
}
