export interface InitiateMultipartUploadRequest {
  taskId: string;
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface MultipartPartsRequest {
  parts: number;
}

export interface MultipartCompletionPartRequest {
  partNumber: number;
  eTag: string;
}

export interface CompleteMultipartUploadRequest {
  taskId: string;
  parts: MultipartCompletionPartRequest[];
}
