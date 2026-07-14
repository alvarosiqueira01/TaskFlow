import 'dotenv/config';

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  awsRegion: string;
  emailSenderAddress: string;
  snsPlatformApplicationArn: string;
  userServiceBaseUrl: string;
  userServiceInternalToken: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadEnvConfig(): EnvConfig {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3007),
    databaseUrl: requireEnv('DATABASE_URL'),
    awsRegion: process.env.AWS_REGION ?? 'us-east-1',
    emailSenderAddress: requireEnv('EMAIL_SENDER_ADDRESS'),
    snsPlatformApplicationArn: requireEnv('SNS_PLATFORM_APPLICATION_ARN'),
    userServiceBaseUrl: requireEnv('USER_SERVICE_BASE_URL'),
    userServiceInternalToken: requireEnv('USER_SERVICE_INTERNAL_TOKEN'),
  };
}
