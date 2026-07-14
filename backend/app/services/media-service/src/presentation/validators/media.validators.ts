import { generateUploadUrlSchema } from '../../schemas/generate-upload-url.schema';
import {
  completeMultipartUploadSchema,
  initiateMultipartUploadSchema,
  multipartPartsRequestSchema,
} from '../../schemas/multipart-upload.schema';
import { completeMediaUploadSchema } from '../../schemas/complete-media-upload.schema';
import { replaceMediaSchema } from '../../schemas/replace-media.schema';
import { mediaIdParamSchema } from '../../schemas/media-id-param.schema';
import { GenerateUploadUrlRequest } from '../../contracts/requests/generate-upload-url.request';
import {
  CompleteMultipartUploadRequest,
  InitiateMultipartUploadRequest,
  MultipartPartsRequest,
} from '../../contracts/requests/multipart-upload.request';
import { CompleteMediaUploadRequest } from '../../contracts/requests/complete-media-upload.request';
import { ReplaceMediaRequest } from '../../contracts/requests/replace-media.request';

export function validateGenerateUploadUrlRequest(body: unknown): GenerateUploadUrlRequest {
  return generateUploadUrlSchema.parse(body);
}

export function validateInitiateMultipartUploadRequest(body: unknown): InitiateMultipartUploadRequest {
  return initiateMultipartUploadSchema.parse(body);
}

export function validateMultipartPartsRequest(body: unknown): MultipartPartsRequest {
  return multipartPartsRequestSchema.parse(body);
}

export function validateCompleteMultipartUploadRequest(body: unknown): CompleteMultipartUploadRequest {
  return completeMultipartUploadSchema.parse(body);
}

export function validateCompleteMediaUploadRequest(body: unknown): CompleteMediaUploadRequest {
  return completeMediaUploadSchema.parse(body);
}

export function validateReplaceMediaRequest(body: unknown): ReplaceMediaRequest {
  return replaceMediaSchema.parse(body);
}

export function validateMediaIdParam(params: unknown): { id: string } {
  return mediaIdParamSchema.parse(params);
}
