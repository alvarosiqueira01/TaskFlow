import 'dotenv/config';

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  awsRegion: string;
  jwtSecret: string;
  jwtIssuer: string;
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
    port: Number(process.env.PORT ?? 3008),
    databaseUrl: requireEnv('DATABASE_URL'),
    awsRegion: process.env.AWS_REGION ?? 'us-east-1',
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtIssuer: requireEnv('JWT_ISSUER'),
  };
}
