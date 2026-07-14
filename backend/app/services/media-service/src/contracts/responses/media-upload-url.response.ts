import {
  MediaStreamDto,
  MediaUploadUrlDto,
  MultipartInitiateDto,
  MultipartPartUrlDto,
} from '../dto/media-upload-url.dto';

export type MediaUploadUrlResponse = MediaUploadUrlDto;
export type MultipartInitiateResponse = MultipartInitiateDto;
export type MediaStreamResponse = MediaStreamDto;

export interface MultipartPartUrlsResponse {
  partUrls: MultipartPartUrlDto[];
}
