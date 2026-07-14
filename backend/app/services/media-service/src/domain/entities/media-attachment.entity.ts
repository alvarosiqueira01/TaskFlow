import { randomUUID } from 'node:crypto';
import { MediaType, MediaTypeValue } from '../value-objects/media-type.value-object';
import { MediaAccessDeniedError } from '../errors/media-access-denied.error';
import { InvalidMediaDataError } from '../errors/invalid-media-data.error';

const ADMIN_ROLE = 'ADMIN';

export interface CreateMediaAttachmentProps {
  taskId: string;
  uploadedBy: string;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

export interface ReplaceMediaProps {
  storageKey: string;
  mimeType: string;
  fileSize: number;
  checksum?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
}

export interface ReconstituteMediaAttachmentProps {
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
  deletedAt?: Date;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface MediaAttachmentPrimitives {
  id: string;
  taskId: string;
  uploadedBy: string;
  mediaType: MediaTypeValue;
  originalFilename: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  thumbnailKey?: string;
  checksum?: string;
  deletedAt?: Date;
  uploadedAt: Date;
  updatedAt: Date;
}

export class MediaAttachment {
  private constructor(
    private readonly id: string,
    private readonly taskId: string,
    private readonly uploadedBy: string,
    private mediaType: MediaType,
    private originalFilename: string,
    private storageKey: string,
    private mimeType: string,
    private fileSize: number,
    private durationSeconds: number | undefined,
    private width: number | undefined,
    private height: number | undefined,
    private thumbnailKey: string | undefined,
    private checksum: string | undefined,
    private deletedAt: Date | undefined,
    private readonly uploadedAt: Date,
    private updatedAt: Date,
  ) {}

  static create(props: CreateMediaAttachmentProps): MediaAttachment {
    if (!props.originalFilename || props.originalFilename.trim().length === 0) {
      throw new InvalidMediaDataError('Media filename must not be empty.');
    }
    if (props.fileSize <= 0) {
      throw new InvalidMediaDataError('Media file size must be greater than zero.');
    }

    const mediaType = MediaType.fromMimeType(props.mimeType);
    const now = new Date();

    return new MediaAttachment(
      randomUUID(),
      props.taskId,
      props.uploadedBy,
      mediaType,
      props.originalFilename.trim(),
      props.storageKey,
      props.mimeType,
      props.fileSize,
      props.durationSeconds,
      props.width,
      props.height,
      undefined,
      props.checksum,
      undefined,
      now,
      now,
    );
  }

  static reconstitute(props: ReconstituteMediaAttachmentProps): MediaAttachment {
    return new MediaAttachment(
      props.id,
      props.taskId,
      props.uploadedBy,
      MediaType.fromMimeType(props.mimeType),
      props.originalFilename,
      props.storageKey,
      props.mimeType,
      props.fileSize,
      props.durationSeconds,
      props.width,
      props.height,
      props.thumbnailKey,
      props.checksum,
      props.deletedAt,
      props.uploadedAt,
      props.updatedAt,
    );
  }

  ensureCanBeManagedBy(userId: string, roles: string[]): void {
    if (roles.includes(ADMIN_ROLE) || this.uploadedBy === userId) {
      return;
    }
    throw new MediaAccessDeniedError('Only the uploader or an administrator may modify this media attachment.');
  }

  replace(props: ReplaceMediaProps): { previousStorageKey: string } {
    const previousStorageKey = this.storageKey;

    this.mediaType = MediaType.fromMimeType(props.mimeType);
    this.storageKey = props.storageKey;
    this.mimeType = props.mimeType;
    this.fileSize = props.fileSize;
    this.checksum = props.checksum;
    this.width = props.width;
    this.height = props.height;
    this.durationSeconds = props.durationSeconds;
    this.thumbnailKey = undefined;
    this.updatedAt = new Date();

    return { previousStorageKey };
  }

  updateThumbnail(thumbnailKey: string): void {
    this.thumbnailKey = thumbnailKey;
    this.updatedAt = new Date();
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = this.deletedAt;
  }

  isDeleted(): boolean {
    return this.deletedAt !== undefined;
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

  getMimeType(): string {
    return this.mimeType;
  }

  toPrimitives(): MediaAttachmentPrimitives {
    return {
      id: this.id,
      taskId: this.taskId,
      uploadedBy: this.uploadedBy,
      mediaType: this.mediaType.toValue(),
      originalFilename: this.originalFilename,
      storageKey: this.storageKey,
      mimeType: this.mimeType,
      fileSize: this.fileSize,
      durationSeconds: this.durationSeconds,
      width: this.width,
      height: this.height,
      thumbnailKey: this.thumbnailKey,
      checksum: this.checksum,
      deletedAt: this.deletedAt,
      uploadedAt: this.uploadedAt,
      updatedAt: this.updatedAt,
    };
  }
}
