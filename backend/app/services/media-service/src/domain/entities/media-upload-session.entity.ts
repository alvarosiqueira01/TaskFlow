import { randomUUID } from 'node:crypto';
import { UPLOAD_URL_EXPIRY_SECONDS } from '../constants/media.constants';
import { MediaAccessDeniedError } from '../errors/media-access-denied.error';
import { InvalidMediaDataError } from '../errors/invalid-media-data.error';
import { MediaAlreadyConfirmedError } from '../errors/media-already-confirmed.error';

export const UPLOAD_SESSION_STATUS_VALUES = ['INITIATED', 'COMPLETED'] as const;
export type UploadSessionStatus = (typeof UPLOAD_SESSION_STATUS_VALUES)[number];

export interface CreateUploadSessionProps {
  taskId: string;
  uploadedBy: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  storageKey: string;
  multipart: boolean;
  s3MultipartUploadId?: string;
}

export interface ReconstituteUploadSessionProps {
  id: string;
  taskId: string;
  uploadedBy: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  storageKey: string;
  multipart: boolean;
  s3MultipartUploadId?: string;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

export interface UploadSessionPrimitives {
  id: string;
  taskId: string;
  uploadedBy: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  storageKey: string;
  multipart: boolean;
  s3MultipartUploadId?: string;
  status: UploadSessionStatus;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
}

export class MediaUploadSession {
  private constructor(
    private readonly id: string,
    private readonly taskId: string,
    private readonly uploadedBy: string,
    private readonly originalFilename: string,
    private readonly contentType: string,
    private readonly fileSize: number,
    private readonly storageKey: string,
    private readonly multipart: boolean,
    private readonly s3MultipartUploadId: string | undefined,
    private status: UploadSessionStatus,
    private readonly createdAt: Date,
    private readonly expiresAt: Date,
    private completedAt: Date | undefined,
  ) {}

  static create(props: CreateUploadSessionProps): MediaUploadSession {
    const now = new Date();
    return new MediaUploadSession(
      randomUUID(),
      props.taskId,
      props.uploadedBy,
      props.originalFilename,
      props.contentType,
      props.fileSize,
      props.storageKey,
      props.multipart,
      props.s3MultipartUploadId,
      'INITIATED',
      now,
      new Date(now.getTime() + UPLOAD_URL_EXPIRY_SECONDS * 1000),
      undefined,
    );
  }

  static reconstitute(props: ReconstituteUploadSessionProps): MediaUploadSession {
    return new MediaUploadSession(
      props.id,
      props.taskId,
      props.uploadedBy,
      props.originalFilename,
      props.contentType,
      props.fileSize,
      props.storageKey,
      props.multipart,
      props.s3MultipartUploadId,
      props.status as UploadSessionStatus,
      props.createdAt,
      props.expiresAt,
      props.completedAt,
    );
  }

  ensureOwnedBy(userId: string): void {
    if (this.uploadedBy !== userId) {
      throw new MediaAccessDeniedError('Only the user who initiated the upload may confirm it.');
    }
  }

  ensureMatchesTask(taskId: string): void {
    if (this.taskId !== taskId) {
      throw new InvalidMediaDataError('The provided taskId does not match the upload session.');
    }
  }

  ensureNotCompleted(): void {
    if (this.status === 'COMPLETED') {
      throw new MediaAlreadyConfirmedError(this.id);
    }
  }

  markCompleted(): void {
    this.ensureNotCompleted();
    this.status = 'COMPLETED';
    this.completedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getTaskId(): string {
    return this.taskId;
  }

  getUploadedBy(): string {
    return this.uploadedBy;
  }

  getStorageKey(): string {
    return this.storageKey;
  }

  getOriginalFilename(): string {
    return this.originalFilename;
  }

  getContentType(): string {
    return this.contentType;
  }

  getFileSize(): number {
    return this.fileSize;
  }

  isMultipart(): boolean {
    return this.multipart;
  }

  getS3MultipartUploadId(): string | undefined {
    return this.s3MultipartUploadId;
  }

  toPrimitives(): UploadSessionPrimitives {
    return {
      id: this.id,
      taskId: this.taskId,
      uploadedBy: this.uploadedBy,
      originalFilename: this.originalFilename,
      contentType: this.contentType,
      fileSize: this.fileSize,
      storageKey: this.storageKey,
      multipart: this.multipart,
      s3MultipartUploadId: this.s3MultipartUploadId,
      status: this.status,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      completedAt: this.completedAt,
    };
  }
}
