import { randomUUID } from 'node:crypto';
import {
  S3Client,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  MediaStorageService,
  MultipartCompletionPart,
  MultipartPartUrl,
  PresignedUploadUrl,
} from '../../../domain/repositories/media-storage.port';

const MEDIA_TYPE_PREFIX: Record<string, string> = {
  VIDEO: 'videos',
  AUDIO: 'audio',
};

function extractExtension(filename: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  return match ? match[1].toLowerCase() : 'bin';
}

function sanitizeFilenameSegment(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export class S3MediaStorageService implements MediaStorageService {
  constructor(
    private readonly client: S3Client,
    private readonly bucketName: string,
    private readonly region: string,
  ) {}

  buildObjectKey(mediaType: string, taskId: string, filename: string): string {
    const prefix = MEDIA_TYPE_PREFIX[mediaType] ?? 'videos';
    const extension = extractExtension(filename);
    const safeFilename = sanitizeFilenameSegment(randomUUID());
    return `${prefix}/${taskId}/${safeFilename}.${extension}`;
  }

  async generatePresignedPutUrl(key: string, contentType: string, expiresInSeconds: number): Promise<PresignedUploadUrl> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });

    return {
      url,
      expiresIn: expiresInSeconds,
      method: 'PUT',
      headers: ['Content-Type', 'Content-Length'],
    };
  }

  async createMultipartUpload(key: string, contentType: string): Promise<string> {
    const result = await this.client.send(
      new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ServerSideEncryption: 'AES256',
      }),
    );

    if (!result.UploadId) {
      throw new Error('S3 did not return a multipart UploadId.');
    }

    return result.UploadId;
  }

  async generateMultipartPartUrls(
    key: string,
    s3UploadId: string,
    partsCount: number,
    expiresInSeconds: number,
  ): Promise<MultipartPartUrl[]> {
    const urls: MultipartPartUrl[] = [];

    for (let partNumber = 1; partNumber <= partsCount; partNumber += 1) {
      const command = new UploadPartCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: s3UploadId,
        PartNumber: partNumber,
      });

      const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
      urls.push({ partNumber, uploadUrl });
    }

    return urls;
  }

  async completeMultipartUpload(key: string, s3UploadId: string, parts: MultipartCompletionPart[]): Promise<void> {
    await this.client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: s3UploadId,
        MultipartUpload: {
          Parts: parts
            .sort((a, b) => a.partNumber - b.partNumber)
            .map((part) => ({ PartNumber: part.partNumber, ETag: part.eTag })),
        },
      }),
    );
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
  }

  getBucketName(): string {
    return this.bucketName;
  }

  getRegion(): string {
    return this.region;
  }
}
