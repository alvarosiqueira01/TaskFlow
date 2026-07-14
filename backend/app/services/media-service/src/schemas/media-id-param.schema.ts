import { z } from 'zod';

export const mediaIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type MediaIdParamSchemaType = z.infer<typeof mediaIdParamSchema>;
