import 'dotenv/config';

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  eventBusName: string;
  awsRegion: string;
  jwtPublicKey: string;
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
    port: Number(process.env.PORT ?? 3005),
    databaseUrl: requireEnv('DATABASE_URL'),
    eventBusName: requireEnv('EVENT_BUS_NAME'),
    awsRegion: process.env.AWS_REGION ?? 'us-east-1',
    jwtPublicKey: requireEnv('JWT_PUBLIC_KEY'),
    jwtIssuer: requireEnv('JWT_ISSUER'),
  };
}
