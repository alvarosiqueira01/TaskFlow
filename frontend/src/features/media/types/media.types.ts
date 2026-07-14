export type MediaType = 'VIDEO' | 'AUDIO';

export interface MediaUploadRequest {
  taskId: string;
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface MediaUploadUrlResponse {
  uploadUrl: string;
  uploadId: string;
  storageKey: string;
  expiresIn: number;
  method: string;
  bucket: string;
  region: string;
  allowedHeaders?: string[];
}

export interface MediaCompleteRequest {
  uploadId: string;
  taskId: string;
  storageKey: string;
  checksum: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface MediaReplaceRequest {
  taskId: string;
  storageKey: string;
  mediaType: MediaType;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  checksum?: string;
}

export interface MediaAttachment {
  id: string;
  taskId: string;
  uploadedBy: string;
  mediaType: MediaType;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  thumbnailKey?: string;
  checksum?: string;
  uploadedAt: string;
}

export interface MediaStreamResponse {
  streamUrl: string;
  expiresAt: string;
  contentType: string;
  supportsRanges: boolean;
}

export interface MultipartInitiateResponse {
  uploadId: string;
  storageKey: string;
}

export interface MultipartPartUrl {
  partNumber: number;
  uploadUrl: string;
}

export interface MultipartCompletePart {
  partNumber: number;
  eTag: string;
}
