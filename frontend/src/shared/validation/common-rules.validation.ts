/**
 * shared/validation/common-rules.validation.ts
 *
 * Reusable Zod primitives mirrored from the field constraints declared
 * in swagger.yaml (`minLength`, `maxLength`, `format: email`, etc.).
 * Feature-specific schemas (e.g. `CreateTaskSchema`) should compose
 * these primitives from their own `types/` or `schemas/` folder rather
 * than redeclaring constraints.
 */

import { z } from 'zod';

/** `format: email` */
export const emailRule = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');

/** `password`, `minLength: 8` (see UserRegistrationRequest / resetPassword / changePassword) */
export const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters long');

/** `format: uuid` */
export const uuidRule = z.string().uuid('Invalid identifier');

/** `username`, `minLength: 3, maxLength: 50` */
export const usernameRule = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters long')
  .max(50, 'Username must be at most 50 characters long');

/** `fullName`, `maxLength: 150` */
export const fullNameRule = z.string().trim().max(150, 'Name is too long').optional();

/** `format: uri` */
export const urlRule = z.string().url('Enter a valid URL').optional().or(z.literal(''));

export function requiredStringRule(label: string, maxLength?: number) {
  let schema = z.string().trim().min(1, `${label} is required`);
  if (maxLength) {
    schema = schema.max(maxLength, `${label} must be at most ${maxLength} characters long`);
  }
  return schema;
}

export function optionalStringRule(maxLength?: number) {
  const schema = maxLength ? z.string().trim().max(maxLength) : z.string().trim();
  return schema.optional().or(z.literal(''));
}

/** `format: date-time` */
export const isoDateTimeRule = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Enter a valid date' });
