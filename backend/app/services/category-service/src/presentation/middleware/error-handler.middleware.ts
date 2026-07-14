import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { DomainException } from '../../domain/exceptions/category.exceptions.js';
import { HTTP_STATUS } from '../../config/constants.js';

const DOMAIN_ERROR_STATUS_MAP: Record<string, number> = {
  CATEGORY_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  FORBIDDEN_CATEGORY_MANAGEMENT: HTTP_STATUS.FORBIDDEN,
  EMPTY_CATEGORY_NAME: HTTP_STATUS.UNPROCESSABLE_ENTITY,
  CATEGORY_NAME_TOO_LONG: HTTP_STATUS.UNPROCESSABLE_ENTITY,
};

export function errorHandler(
  error: FastifyError | ZodError | DomainException | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof ZodError) {
    reply.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
      type: 'https://api.taskmanager.local/errors/validation-error',
      title: 'Validation Error',
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      detail: 'The provided request payload failed validation.',
      instance: request.url,
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof DomainException) {
    const status = DOMAIN_ERROR_STATUS_MAP[error.code] ?? HTTP_STATUS.BAD_REQUEST;
    reply.status(status).send({
      type: `https://api.taskmanager.local/errors/${error.code.toLowerCase().replace(/_/g, '-')}`,
      title: error.name,
      status,
      detail: error.message,
      instance: request.url,
    });
    return;
  }

  request.log.error(error);
  reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
    type: 'https://api.taskmanager.local/errors/internal-server-error',
    title: 'Internal Server Error',
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    detail: 'An unexpected error occurred.',
    instance: request.url,
  });
}
