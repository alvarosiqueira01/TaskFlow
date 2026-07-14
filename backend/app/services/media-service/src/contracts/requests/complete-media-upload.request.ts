export interface CompleteMediaUploadRequest {
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
