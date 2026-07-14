export interface MediaAttachmentDto {
  id: string;
  taskId: string;
  uploadedBy: string;
  mediaType: string;
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
