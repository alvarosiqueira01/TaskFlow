import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  EVENT_BUS_NAME: z.string().min(1, 'EVENT_BUS_NAME is required'),
  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  MEDIA_BUCKET_NAME: z.string().min(1, 'MEDIA_BUCKET_NAME is required'),
  CLOUDFRONT_DOMAIN: z.string().min(1, 'CLOUDFRONT_DOMAIN is required'),
  CLOUDFRONT_KEY_PAIR_ID: z.string().min(1, 'CLOUDFRONT_KEY_PAIR_ID is required'),
  CLOUDFRONT_PRIVATE_KEY: z.string().min(1, 'CLOUDFRONT_PRIVATE_KEY is required'),
  TASK_SERVICE_BASE_URL: z.string().url('TASK_SERVICE_BASE_URL must be a valid URL'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${details}`);
  }
  return parsed.data;
}
