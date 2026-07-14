import { ref } from 'vue';
import { MediaService } from '../services/MediaService';
import type { MediaAttachment, MediaType } from '../types/media.types';

function inferMediaType(mimeType: string): MediaType {
  return mimeType.startsWith('audio/') ? 'AUDIO' : 'VIDEO';
}

function putToS3(uploadUrl: string, file: File, contentType: string, onProgress: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed with status ${xhr.status}`));
    xhr.onerror = () => reject(new Error('Network error during S3 upload.'));
    xhr.send(file);
  });
}

/**
 * Uploads a new object to S3 (reusing the same pre-signed URL flow as a
 * fresh upload), then calls PUT /media/{id} to associate it with an
 * existing attachment. The previous object is scheduled for async
 * deletion server-side per the contract description.
 */
export function useMediaReplace() {
  const status = ref<'idle' | 'uploading' | 'confirming' | 'success' | 'error'>('idle');
  const progress = ref(0);
  const error = ref<string | null>(null);

  async function replaceFile(mediaId: string, taskId: string, file: File): Promise<MediaAttachment> {
    status.value = 'uploading';
    progress.value = 0;
    error.value = null;

    try {
      const uploadDetails = await MediaService.generateUploadUrl({
        taskId,
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      await putToS3(uploadDetails.uploadUrl, file, file.type, (percent) => {
        progress.value = percent;
      });

      status.value = 'confirming';
      const updated = await MediaService.replaceMedia(
        mediaId,
        {
          taskId,
          storageKey: uploadDetails.storageKey,
          mediaType: inferMediaType(file.type),
          originalFilename: file.name,
          mimeType: file.type,
          fileSize: file.size,
        },
        crypto.randomUUID(),
      );

      status.value = 'success';
      progress.value = 100;
      return updated;
    } catch (err) {
      status.value = 'error';
      error.value = err instanceof Error ? err.message : 'Failed to replace media.';
      throw err;
    }
  }

  function reset() {
    status.value = 'idle';
    progress.value = 0;
    error.value = null;
  }

  return { status, progress, error, replaceFile, reset };
}
