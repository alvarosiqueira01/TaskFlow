/** Files larger than this use the multipart upload flow instead of a single PUT. */
export const MULTIPART_THRESHOLD_BYTES = 50 * 1024 * 1024; // 50MB

/** Size of each part in a multipart upload. */
export const MULTIPART_CHUNK_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export const ACCEPTED_MEDIA_INPUT_ACCEPT = 'video/*,audio/*';
