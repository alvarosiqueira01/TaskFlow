import { Assignment } from '../entities/assignment.entity.js';

export interface AssignmentRepository {
  save(assignment: Assignment): Promise<void>;
  findByTaskAndUser(taskId: string, userId: string): Promise<Assignment | null>;
  findByTaskId(taskId: string): Promise<Assignment[]>;
  delete(taskId: string, userId: string): Promise<void>;
}
