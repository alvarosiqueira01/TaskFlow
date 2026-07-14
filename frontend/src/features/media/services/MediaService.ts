import { httpClient } from '@/core/api/http-client';
import type {
  MediaAttachment,
  MediaCompleteRequest,
  MediaReplaceRequest,
  MediaStreamResponse,
  MediaUploadRequest,
  MediaUploadUrlResponse,
  MultipartCompletePart,
  MultipartInitiateResponse,
  MultipartPartUrl,
} from '../types/media.types';

const BASE_PATH = '/media';

export const MediaService = {
  async generateUploadUrl(request: MediaUploadRequest): Promise<MediaUploadUrlResponse> {
    const { data } = await httpClient.post<MediaUploadUrlResponse>(`${BASE_PATH}/upload-url`, request);
    return data;
  },

  async completeMediaUpload(request: MediaCompleteRequest, idempotencyKey?: string): Promise<MediaAttachment> {
    const { data } = await httpClient.post<MediaAttachment>(`${BASE_PATH}/complete`, request, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    });
    return data;
  },

  async initiateMultipartUpload(request: MediaUploadRequest): Promise<MultipartInitiateResponse> {
    const { data } = await httpClient.post<MultipartInitiateResponse>(`${BASE_PATH}/multipart`, request);
    return data;
  },

  async getMultipartPreSignedUrls(mediaId: string, parts: number): Promise<{ partUrls: MultipartPartUrl[] }> {
    const { data } = await httpClient.post<{ partUrls: MultipartPartUrl[] }>(
      `${BASE_PATH}/multipart/${mediaId}/parts`,
      { parts },
    );
    return data;
  },

  async completeMultipartUpload(
    mediaId: string,
    payload: { taskId: string; parts: MultipartCompletePart[] },
    idempotencyKey?: string,
  ): Promise<MediaAttachment> {
    const { data } = await httpClient.post<MediaAttachment>(
      `${BASE_PATH}/multipart/${mediaId}/complete`,
      payload,
      { headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined },
    );
    return data;
  },

  async getMedia(id: string): Promise<MediaAttachment> {
    const { data } = await httpClient.get<MediaAttachment>(`${BASE_PATH}/${id}`);
    return data;
  },

  async replaceMedia(id: string, request: MediaReplaceRequest, idempotencyKey?: string): Promise<MediaAttachment> {
    const { data } = await httpClient.put<MediaAttachment>(`${BASE_PATH}/${id}`, request, {
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
    });
    return data;
  },

  async deleteMedia(id: string): Promise<void> {
    await httpClient.delete(`${BASE_PATH}/${id}`);
  },

  async getMediaStreamUrl(id: string): Promise<MediaStreamResponse> {
    const { data } = await httpClient.get<MediaStreamResponse>(`${BASE_PATH}/${id}/stream`);
    return data;
  },
};
