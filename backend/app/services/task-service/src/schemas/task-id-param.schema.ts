import { z } from 'zod';

export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type TaskIdParamSchemaType = z.infer<typeof taskIdParamSchema>;
