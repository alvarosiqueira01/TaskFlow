import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { MediaNotFoundError } from '../../domain/errors/media-not-found.error';
import { MediaGoneError } from '../../domain/errors/media-gone.error';
import { MediaAccessDeniedError } from '../../domain/errors/media-access-denied.error';
import { InvalidMediaDataError } from '../../domain/errors/invalid-media-data.error';
import { UnsupportedMediaTypeError } from '../../domain/errors/unsupported-media-type.error';
import { MediaTooLargeError } from '../../domain/errors/media-too-large.error';
import { UploadSessionNotFoundError } from '../../domain/errors/upload-session-not-found.error';
import { MediaAlreadyConfirmedError } from '../../domain/errors/media-already-confirmed.error';
import { TaskReferenceNotFoundError } from '../../domain/errors/task-reference-not-found.error';
import { TaskReferenceAccessDeniedError } from '../../domain/errors/task-reference-access-denied.error';
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
    const send = (status: number, title: string) =>
      reply.code(status).type('application/problem+json').send(buildProblem(status, title, error.message, instance));

    if (error instanceof ZodError) {
      const problem = buildProblem(400, 'Bad Request', 'The request payload failed schema validation.', instance,
        error.issues.map((issue) => ({ field: issue.path.join('.') || '(root)', message: issue.message })));
      reply.code(400).type('application/problem+json').send(problem);
      return;
    }

    if (error instanceof AuthenticationError || error instanceof JwtTokenInvalidError) {
      send(401, 'Unauthorized');
      return;
    }

    if (error instanceof MediaAccessDeniedError || error instanceof TaskReferenceAccessDeniedError) {
      send(403, 'Forbidden');
      return;
    }

    if (error instanceof MediaNotFoundError || error instanceof UploadSessionNotFoundError || error instanceof TaskReferenceNotFoundError) {
      send(404, 'Not Found');
      return;
    }

    if (error instanceof MediaAlreadyConfirmedError) {
      send(409, 'Conflict');
      return;
    }

    if (error instanceof MediaGoneError) {
      send(410, 'Gone');
      return;
    }

    if (error instanceof MediaTooLargeError) {
      send(413, 'Payload Too Large');
      return;
    }

    if (error instanceof UnsupportedMediaTypeError) {
      send(415, 'Unsupported Media Type');
      return;
    }

    if (error instanceof InvalidMediaDataError) {
      send(422, 'Unprocessable Entity');
      return;
    }

    request.log.error(error);
    send(500, 'Internal Server Error');
  });
}
