import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../errors/error-mapper';
import type { ProblemDetails } from '../contracts/responses/problem-details';

export function errorHandlerMiddleware(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const httpError = mapErrorToHttp(error);

  request.log?.error(
    {
      err: error,
      statusCode: httpError.statusCode,
      code: httpError.code,
      correlationId: request.correlationId,
    },
    'request failed',
  );

  const problem: ProblemDetails = {
    type: `https://api.taskmanager.local/errors/${httpError.code.toLowerCase().replace(/_/g, '-')}`,
    title: httpError.code.replace(/_/g, ' '),
    status: httpError.statusCode,
    detail: httpError.message,
    instance: request.url,
  };

  if (httpError.statusCode === 422 && Array.isArray(httpError.details)) {
    problem.errors = httpError.details as { field: string; message: string }[];
  }

  reply.status(httpError.statusCode).type('application/problem+json').send(problem);
}
