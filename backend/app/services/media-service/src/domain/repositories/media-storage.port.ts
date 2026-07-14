export interface PresignedUploadUrl {
  url: string;
  expiresIn: number;
  method: string;
  headers?: string[];
}

export interface MultipartPartUrl {
  partNumber: number;
  uploadUrl: string;
}

export interface MultipartCompletionPart {
  partNumber: number;
  eTag: string;
}

/**
 * Port implemented by the Infrastructure layer using the Amazon S3 SDK.
 * The Application layer never depends on AWS SDK types directly.
 */
export interface MediaStorageService {
  buildObjectKey(mediaType: string, taskId: string, filename: string): string;
  generatePresignedPutUrl(key: string, contentType: string, expiresInSeconds: number): Promise<PresignedUploadUrl>;
  createMultipartUpload(key: string, contentType: string): Promise<string>;
  generateMultipartPartUrls(
    key: string,
    s3UploadId: string,
    partsCount: number,
    expiresInSeconds: number,
  ): Promise<MultipartPartUrl[]>;
  completeMultipartUpload(key: string, s3UploadId: string, parts: MultipartCompletionPart[]): Promise<void>;
  deleteObject(key: string): Promise<void>;
  getBucketName(): string;
  getRegion(): string;
}
