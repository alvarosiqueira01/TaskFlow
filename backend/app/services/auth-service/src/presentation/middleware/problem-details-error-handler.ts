import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp, ValidationError, correlationIdMiddleware } from '@backend/shared';
import type { ProblemDetails } from '../../contracts/responses/problem-details.response';

const PROBLEM_TYPE_BASE_URL = 'https://api.taskmanager.local/errors';

/**
 * auth-service's error responses must conform to the RFC 9457
 * `ProblemDetails` schema declared in _A6_swagger.yaml
 * (`application/problem+json`), rather than the shared generic
 * envelope, since that is the contract this service must honor.
 */
export function problemDetailsErrorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const httpError = mapErrorToHttp(error);

  request.log?.error(
    { err: error, statusCode: httpError.statusCode, code: httpError.code, correlationId: request.correlationId },
    'request failed',
  );

  const problem: ProblemDetails = {
    type: `${PROBLEM_TYPE_BASE_URL}/${httpError.code.toLowerCase().replace(/_/g, '-')}`,
    title: httpError.message,
    status: httpError.statusCode,
    instance: request.url,
  };

  const originalError = error instanceof ValidationError ? error : undefined;
  if (originalError) {
    problem.detail = 'One or more fields failed validation';
    problem.errors = originalError.issues.map((issue: any) => ({ 
      field: issue.field ?? issue.path?.join('.'), 
      message: issue.message 
    }));
  } else if (httpError.details && typeof httpError.details === 'object') {
    problem.detail = JSON.stringify(httpError.details);
  }

  reply.status(httpError.statusCode).type('application/problem+json').send(problem);
}
