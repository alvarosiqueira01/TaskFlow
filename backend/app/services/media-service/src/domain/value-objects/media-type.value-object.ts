import { ALLOWED_MIME_TYPES } from '../constants/media.constants';
import { UnsupportedMediaTypeError } from '../errors/unsupported-media-type.error';

export const MEDIA_TYPE_VALUES = ['VIDEO', 'AUDIO'] as const;
export type MediaTypeValue = (typeof MEDIA_TYPE_VALUES)[number];

export class MediaType {
  private constructor(private readonly value: MediaTypeValue) {}

  static fromMimeType(mimeType: string): MediaType {
    if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
      throw new UnsupportedMediaTypeError(mimeType);
    }

    if (mimeType.startsWith('video/')) {
      return new MediaType('VIDEO');
    }
    if (mimeType.startsWith('audio/')) {
      return new MediaType('AUDIO');
    }
    throw new UnsupportedMediaTypeError(mimeType);
  }

  toValue(): MediaTypeValue {
    return this.value;
  }
}
