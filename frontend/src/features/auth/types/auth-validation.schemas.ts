/**
 * features/auth/types/auth-validation.schemas.ts
 *
 * Per `guidelines.md` (`feature-development-workflow.md` step 3):
 * "Create Zod schemas for validation... in shared frontend types."
 * Feature-specific schemas compose the primitives declared in
 * `shared/validation/common-rules.validation.ts` rather than
 * redeclaring field constraints already mirrored from swagger.yaml.
 */

import { z } from 'zod';
import { emailRule, fullNameRule, passwordRule, requiredStringRule, usernameRule } from '../../../shared/validation/common-rules.validation';

export const loginFormSchema = z.object({
  email: emailRule,
  password: requiredStringRule('Password'),
});

export const registerFormSchema = z
  .object({
    username: usernameRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: requiredStringRule('Confirm password'),
    fullName: fullNameRule,
  })
  .refine((form) => form.password === form.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordFormSchema = z.object({
  email: emailRule,
});

export const resetPasswordFormSchema = z
  .object({
    newPassword: passwordRule,
    confirmPassword: requiredStringRule('Confirm password'),
  })
  .refine((form) => form.newPassword === form.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
