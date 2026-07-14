import { ref } from 'vue';
import { MediaService } from '../services/MediaService';
import { MULTIPART_CHUNK_SIZE_BYTES, MULTIPART_THRESHOLD_BYTES } from '../constants/upload';
import type { MediaAttachment, MultipartCompletePart } from '../types/media.types';

export type UploadStatus = 'idle' | 'requesting-url' | 'uploading' | 'confirming' | 'success' | 'error';

function putToS3(
  uploadUrl: string,
  body: Blob,
  contentType: string,
  onProgress: (percent: number) => void,
): Promise<{ etag: string | null }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ etag: xhr.getResponseHeader('ETag') });
      } else {
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during S3 upload.'));
    xhr.send(body);
  });
}

async function computeSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Direct-to-S3 upload flow. Files at or below MULTIPART_THRESHOLD_BYTES
 * use the single pre-signed URL flow (upload-url -> PUT -> complete);
 * larger files are chunked through the multipart flow
 * (multipart -> parts -> PUT each part -> multipart/complete).
 * The client never uploads binary data through the authenticated core
 * API client — only directly to the pre-signed S3 URLs.
 */
export function useMediaUpload() {
  const status = ref<UploadStatus>('idle');
  const progress = ref(0);
  const error = ref<string | null>(null);

  async function uploadFile(taskId: string, file: File): Promise<MediaAttachment> {
    status.value = 'requesting-url';
    progress.value = 0;
    error.value = null;

    try {
      if (file.size <= MULTIPART_THRESHOLD_BYTES) {
        const uploadDetails = await MediaService.generateUploadUrl({
          taskId,
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        });

        status.value = 'uploading';
        await putToS3(uploadDetails.uploadUrl, file, file.type, (percent) => {
          progress.value = percent;
        });

        status.value = 'confirming';
        const checksum = await computeSha256(file);
        const attachment = await MediaService.completeMediaUpload(
          {
            uploadId: uploadDetails.uploadId,
            taskId,
            storageKey: uploadDetails.storageKey,
            checksum,
            mimeType: file.type,
            fileSize: file.size,
          },
          crypto.randomUUID(),
        );

        status.value = 'success';
        progress.value = 100;
        return attachment;
      }

      const initiate = await MediaService.initiateMultipartUpload({
        taskId,
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      const totalParts = Math.ceil(file.size / MULTIPART_CHUNK_SIZE_BYTES);
      const { partUrls } = await MediaService.getMultipartPreSignedUrls(initiate.uploadId, totalParts);

      status.value = 'uploading';
      const completedParts: MultipartCompletePart[] = [];
      let uploadedBytes = 0;

      for (const partUrl of partUrls) {
        const start = (partUrl.partNumber - 1) * MULTIPART_CHUNK_SIZE_BYTES;
        const end = Math.min(start + MULTIPART_CHUNK_SIZE_BYTES, file.size);
        const chunk = file.slice(start, end);

        const { etag } = await putToS3(partUrl.uploadUrl, chunk, file.type, (percent) => {
          const chunkBytes = (end - start) * (percent / 100);
          progress.value = Math.round(((uploadedBytes + chunkBytes) / file.size) * 100);
        });

        uploadedBytes += end - start;
        completedParts.push({ partNumber: partUrl.partNumber, eTag: etag ?? '' });
      }

      status.value = 'confirming';
      const attachment = await MediaService.completeMultipartUpload(
        initiate.uploadId,
        { taskId, parts: completedParts },
        crypto.randomUUID(),
      );

      status.value = 'success';
      progress.value = 100;
      return attachment;
    } catch (err) {
      status.value = 'error';
      error.value = err instanceof Error ? err.message : 'Failed to upload media.';
      throw err;
    }
  }

  function reset() {
    status.value = 'idle';
    progress.value = 0;
    error.value = null;
  }

  return { status, progress, error, uploadFile, reset };
}
