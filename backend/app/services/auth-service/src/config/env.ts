import 'dotenv/config';
import { z } from 'zod';
import { parseEnv, sharedEnvSchema } from '@backend/shared';

/**
 * auth-service extends the shared environment schema with its own
 * domain-specific variables. It must never redeclare shared variables.
 */
export const authServiceEnvSchema = sharedEnvSchema.extend({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  PASSWORD_RESET_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  PASSWORD_RESET_SECRET: z.string().min(16, 'PASSWORD_RESET_SECRET must have at least 16 characters'),
  MAIL_FROM_ADDRESS: z.string().email().default('no-reply@taskmanager.local'),
  APP_BASE_URL: z.string().url().default('https://app.taskmanager.local'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(10),
});

export type AuthServiceEnv = z.infer<typeof authServiceEnvSchema>;

export function loadAuthServiceEnv(source: NodeJS.ProcessEnv = process.env): AuthServiceEnv {
  return parseEnv(authServiceEnvSchema, source);
}
