import { z } from 'zod';

export const categoryInputSchema = z.object({
  name: z.string().min(1, 'Category name must not be empty').max(100),
  description: z.string().max(255).optional(),
  color: z.string().max(20).optional(),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
