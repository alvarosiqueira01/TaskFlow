import { z } from 'zod';

export const mediaUploadedEventSchema = z.object({
  mediaId: z.string().uuid(),
  taskId: z.string().uuid(),
  uploadedBy: z.string().uuid(),
  mediaType: z.enum(['VIDEO', 'AUDIO']),
  fileSize: z.number().int(),
  uploadedAt: z.string().datetime(),
});

export type MediaUploadedEventPayload = z.infer<typeof mediaUploadedEventSchema>;
