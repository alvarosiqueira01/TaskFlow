import { z } from 'zod';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../domain/constants/media.constants';

export const generateUploadUrlSchema = z.object({
  taskId: z.string().uuid(),
  filename: z.string().min(1).max(255),
  contentType: z.enum(ALLOWED_MIME_TYPES),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
});

export type GenerateUploadUrlSchemaType = z.infer<typeof generateUploadUrlSchema>;
