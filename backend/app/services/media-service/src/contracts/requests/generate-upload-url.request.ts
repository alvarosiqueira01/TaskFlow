export interface GenerateUploadUrlRequest {
  taskId: string;
  filename: string;
  contentType: string;
  fileSize: number;
}
