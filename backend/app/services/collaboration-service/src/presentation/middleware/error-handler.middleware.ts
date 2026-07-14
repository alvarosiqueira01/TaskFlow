import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { DomainException } from '../../domain/exceptions/collaboration.exceptions.js';
import { HTTP_STATUS } from '../../config/constants.js';

const DOMAIN_ERROR_STATUS_MAP: Record<string, number> = {
  TASK_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  ASSIGNMENT_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  COMMENT_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  PARENT_COMMENT_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  NOTIFICATION_NOT_FOUND: HTTP_STATUS.NOT_FOUND,
  DUPLICATE_ASSIGNMENT: HTTP_STATUS.CONFLICT,
  FORBIDDEN_ASSIGNMENT: HTTP_STATUS.FORBIDDEN,
  FORBIDDEN_NOTIFICATION_ACCESS: HTTP_STATUS.FORBIDDEN,
  EMPTY_COMMENT_CONTENT: HTTP_STATUS.UNPROCESSABLE_ENTITY,
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
