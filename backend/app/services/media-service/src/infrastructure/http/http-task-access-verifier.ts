import {
  AssertTaskAccessParams,
  TaskAccessVerifier,
} from '../../domain/repositories/task-access-verifier.port';
import { TaskReferenceNotFoundError } from '../../domain/errors/task-reference-not-found.error';
import { TaskReferenceAccessDeniedError } from '../../domain/errors/task-reference-access-denied.error';

/**
 * HTTP-based implementation of the TaskAccessVerifier port. Calls task-service
 * synchronously (per the REST communication strategy in (A3)arquitecture.md §5)
 * to confirm the requester may view or modify the referenced task before
 * allowing a media operation against it.
 */
export class HttpTaskAccessVerifier implements TaskAccessVerifier {
  constructor(private readonly taskServiceBaseUrl: string) {}

  async assertAccess(params: AssertTaskAccessParams): Promise<void> {
    const response = await fetch(`${this.taskServiceBaseUrl}/tasks/${params.taskId}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${params.bearerToken}`,
      },
    });

    if (response.ok) {
      return;
    }

    if (response.status === 404) {
      throw new TaskReferenceNotFoundError(params.taskId);
    }

    if (response.status === 401 || response.status === 403) {
      throw new TaskReferenceAccessDeniedError(params.taskId);
    }

    throw new Error(`Unexpected response from task-service (status ${response.status}).`);
  }
}
