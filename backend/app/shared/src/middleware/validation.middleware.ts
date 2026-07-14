import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeAny } from 'zod';
import { ValidationError, type ValidationIssue } from '../errors/validation-error';

export interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
  headers?: ZodTypeAny;
}

export function buildValidationMiddleware(schemas: ValidationSchemas) {
  return async function validationMiddleware(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    const issues: ValidationIssue[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(request.body);
      if (!result.success) issues.push(...formatIssues(result.error.issues, 'body'));
      else request.body = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(request.query);
      if (!result.success) issues.push(...formatIssues(result.error.issues, 'query'));
      else request.query = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(request.params);
      if (!result.success) issues.push(...formatIssues(result.error.issues, 'params'));
      else request.params = result.data;
    }

    if (issues.length > 0) throw new ValidationError(issues);
  };
}

function formatIssues(zodIssues: { path: (string | number)[]; message: string }[], scope: string): ValidationIssue[] {
  return zodIssues.map((issue) => ({
    field: `${scope}.${issue.path.join('.')}`,
    message: issue.message,
  }));
}
