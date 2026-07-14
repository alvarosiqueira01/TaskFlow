import { z } from 'zod';

export const emailSchema = z.string().email('must be a valid email address');
export const passwordSchema = z.string().min(8).max(128);
export const nonEmptyStringSchema = z.string().trim().min(1, 'must not be empty');
export const isoDateSchema = z.string().datetime({ message: 'must be a valid ISO-8601 date' });
export const uuidSchema = z.string().uuid('must be a valid UUID');
