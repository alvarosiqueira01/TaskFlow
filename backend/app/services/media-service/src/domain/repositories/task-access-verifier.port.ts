export type TaskAccessAction = 'VIEW' | 'MODIFY';

export interface AssertTaskAccessParams {
  taskId: string;
  action: TaskAccessAction;
  bearerToken: string;
}

/**
 * Port used by the Application layer to validate, against task-service, that the
 * requester may view or attach media to a given task. Implemented in Infrastructure
 * via an HTTP call, since Media Service does not own Task data.
 */
export interface TaskAccessVerifier {
  assertAccess(params: AssertTaskAccessParams): Promise<void>;
}
