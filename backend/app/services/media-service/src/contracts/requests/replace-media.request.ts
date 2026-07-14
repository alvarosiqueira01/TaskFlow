/** Spec extension (see (A5)streaming-design.md §13 "Replace"), used by PUT /media/{id}. */
export interface ReplaceMediaRequest {
  storageKey: string;
  checksum: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}
