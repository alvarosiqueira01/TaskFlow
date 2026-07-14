export const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/webm',
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/** Single-part upload / streaming caps, per (A5)streaming-design.md. */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB
export const MULTIPART_THRESHOLD_BYTES = 100 * 1024 * 1024; // 100 MB, per A5 §18

export const UPLOAD_URL_EXPIRY_SECONDS = 600; // 10 minutes, per A5 §7 Step 3
export const MULTIPART_PART_URL_EXPIRY_SECONDS = 600;
export const STREAM_URL_EXPIRY_SECONDS = 300; // 5 minutes, per A5 §8

export const MAX_MULTIPART_PARTS = 10000; // per swagger parts maximum
