import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { TaskNotFoundError } from '../../domain/errors/task-not-found.error';
import { TaskAccessDeniedError } from '../../domain/errors/task-access-denied.error';
import { InvalidTaskDataError } from '../../domain/errors/invalid-task-data.error';
import { AuthenticationError } from './auth.middleware';
import { JwtTokenInvalidError } from '../../infrastructure/jwt/jwt-verifier';
import { ProblemDetailsResponse } from '../../contracts/responses/problem-details.response';

const PROBLEM_BASE_URI = 'https://api.taskmanager.local/errors';

function buildProblem(
  status: number,
  title: string,
  detail: string,
  instance: string,
  errors?: ProblemDetailsResponse['errors'],
): ProblemDetailsResponse {
  return {
    type: `${PROBLEM_BASE_URI}/${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    status,
    detail,
    instance,
    errors,
  };
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    const instance = request.url;

    if (error instanceof ZodError) {
      const problem = buildProblem(
        400,
        'Bad Request',
        'The request payload failed schema validation.',
        instance,
        error.issues.map((issue) => ({
          field: issue.path.join('.') || '(root)',
          message: issue.message,
        })),
      );
      reply.code(400).type('application/problem+json').send(problem);
      return;
    }

    if (error instanceof AuthenticationError || error instanceof JwtTokenInvalidError) {
      reply
        .code(401)
        .type('application/problem+json')
        .send(buildProblem(401, 'Unauthorized', error.message, instance));
      return;
    }

    if (error instanceof TaskAccessDeniedError) {
      reply
        .code(403)
        .type('application/problem+json')
        .send(buildProblem(403, 'Forbidden', error.message, instance));
      return;
    }

    if (error instanceof TaskNotFoundError) {
      reply
        .code(404)
        .type('application/problem+json')
        .send(buildProblem(404, 'Not Found', error.message, instance));
      return;
    }

    if (error instanceof InvalidTaskDataError) {
      reply
        .code(422)
        .type('application/problem+json')
        .send(buildProblem(422, 'Unprocessable Entity', error.message, instance));
      return;
    }

    request.log.error(error);
    reply
      .code(500)
      .type('application/problem+json')
      .send(buildProblem(500, 'Internal Server Error', 'An unexpected error occurred.', instance));
  });
}
