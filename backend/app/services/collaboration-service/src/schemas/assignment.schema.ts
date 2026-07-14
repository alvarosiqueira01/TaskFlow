import { z } from 'zod';

export const taskIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const assignUserToTaskBodySchema = z.object({
  userId: z.string().uuid(),
});

export const removeAssignmentParamsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export type AssignUserToTaskBody = z.infer<typeof assignUserToTaskBodySchema>;
