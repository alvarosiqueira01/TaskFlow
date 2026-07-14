import { z } from 'zod';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../domain/constants/media.constants';

export const replaceMediaSchema = z.object({
  storageKey: z.string().min(1),
  checksum: z.string().min(1),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  fileSize: z.number().int().min(1).max(MAX_FILE_SIZE_BYTES),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().int().nonnegative().optional(),
});

export type ReplaceMediaSchemaType = z.infer<typeof replaceMediaSchema>;
