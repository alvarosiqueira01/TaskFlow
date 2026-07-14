import { z } from 'zod';

export const sharedEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  SERVICE_NAME: z.string().min(1, 'SERVICE_NAME is required'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must have at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  AWS_REGION: z.string().default('us-east-1'),
  EVENT_BUS_NAME: z.string().default('default'),
  DATABASE_URL: z.string().url().optional(),
  ENABLE_TRACING: z.string().default('true').transform((val) => val === 'true'),
});

export type SharedEnv = z.infer<typeof sharedEnvSchema>;

export function parseEnv<T extends z.ZodTypeAny>(schema: T, source: NodeJS.ProcessEnv = process.env): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const formatted = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }
  return result.data;
}

export function loadSharedEnv(source: NodeJS.ProcessEnv = process.env): SharedEnv {
  return parseEnv(sharedEnvSchema, source);
}
