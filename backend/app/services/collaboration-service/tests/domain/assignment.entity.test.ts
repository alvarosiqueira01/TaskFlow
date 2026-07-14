import { Assignment } from '../../src/domain/entities/assignment.entity.js';

describe('Assignment entity', () => {
  it('creates an assignment with generated id and timestamp', () => {
    const assignment = Assignment.create({
      taskId: 'task-1',
      userId: 'user-1',
      assignedBy: 'owner-1',
    });

    expect(assignment.id).toBeDefined();
    expect(assignment.taskId).toBe('task-1');
    expect(assignment.userId).toBe('user-1');
    expect(assignment.assignedBy).toBe('owner-1');
    expect(assignment.assignedAt).toBeInstanceOf(Date);
  });
});
