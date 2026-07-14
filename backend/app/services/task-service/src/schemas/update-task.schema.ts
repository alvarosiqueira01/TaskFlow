import { z } from 'zod';
import { createTaskSchema } from './create-task.schema';

export const updateTaskSchema = createTaskSchema;

export type UpdateTaskSchemaType = z.infer<typeof updateTaskSchema>;
