/**
 * Catalog of domain events published/consumed by media-service,
 * per (A3)arquitecture.md §9 and (A5)streaming-design.md §12.
 */
export const MEDIA_EVENT_SOURCE = 'media-service';

export const MEDIA_EVENT_DETAIL_TYPES = {
  MEDIA_UPLOAD_REQUESTED: 'MediaUploadRequested',
  MEDIA_UPLOADED: 'MediaUploaded',
  MEDIA_REPLACED: 'MediaReplaced',
  MEDIA_DELETED: 'MediaDeleted',
} as const;

export type MediaEventDetailType = (typeof MEDIA_EVENT_DETAIL_TYPES)[keyof typeof MEDIA_EVENT_DETAIL_TYPES];

export const MEDIA_EVENT_CONSUMERS: Record<MediaEventDetailType, string[]> = {
  MediaUploadRequested: [],
  MediaUploaded: ['reporting-service', 'thumbnail-processor'],
  MediaReplaced: ['thumbnail-processor'],
  MediaDeleted: ['reporting-service'],
};

/** Event consumed by media-service, published externally by the Thumbnail Processor. */
export const THUMBNAIL_GENERATED_DETAIL_TYPE = 'ThumbnailGenerated';

export interface ThumbnailGeneratedDetail {
  eventVersion: string;
  occurredAt: string;
  payload: {
    mediaId: string;
    taskId: string;
    thumbnailKey: string;
  };
}
