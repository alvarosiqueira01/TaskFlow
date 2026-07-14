import type { ZodTypeAny, z } from 'zod';
import { ValidationError } from '../errors/validation-error';

export function validateOrThrow<T extends ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ValidationError(issues);
  }

  return result.data;
}
