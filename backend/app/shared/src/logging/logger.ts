import pino, { type Logger, type LoggerOptions } from 'pino';

export interface CreateLoggerOptions {
  serviceName: string;
  level?: string;
  environment?: string;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const { serviceName, level = 'info', environment = 'development' } = options;

  const pinoOptions: LoggerOptions = {
    level,
    base: { service: serviceName, environment },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    transport: environment === 'development' ? { target: 'pino-pretty', options: { colorize: true, ignore: 'pid,hostname' } } : undefined,
  };
  return pino(pinoOptions);
}

export function withCorrelationId(logger: Logger, correlationId: string): Logger {
  return logger.child({ correlationId });
}

export type { Logger };
