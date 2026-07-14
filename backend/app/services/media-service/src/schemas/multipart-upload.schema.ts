import { z } from 'zod';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MAX_MULTIPART_PARTS } from '../domain/constants/media.constants';

export const initiateMultipartUploadSchema = z.object({
  taskId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_MIME_TYPES),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
});

export const multipartPartsRequestSchema = z.object({
  parts: z.number().int().min(1).max(MAX_MULTIPART_PARTS),
});

export const multipartCompletionPartSchema = z.object({
  partNumber: z.number().int().min(1),
  eTag: z.string().min(1),
});

export const completeMultipartUploadSchema = z.object({
  taskId: z.string().uuid(),
  parts: z.array(multipartCompletionPartSchema).min(1),
});
