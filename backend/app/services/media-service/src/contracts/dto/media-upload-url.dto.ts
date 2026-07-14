export interface MediaUploadUrlDto {
  uploadUrl: string;
  uploadId: string;
  storageKey: string;
  expiresIn: number;
  method: string;
  bucket: string;
  region: string;
  allowedHeaders: string[];
}

export interface MultipartInitiateDto {
  uploadId: string;
  storageKey: string;
}

export interface MultipartPartUrlDto {
  partNumber: number;
  uploadUrl: string;
}

export interface MediaStreamDto {
  streamUrl: string;
  expiresAt: string;
  contentType: string;
  supportsRanges: boolean;
}
