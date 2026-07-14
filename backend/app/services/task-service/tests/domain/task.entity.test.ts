import { Task } from '../../src/domain/entities/task.entity';
import { TaskAccessDeniedError } from '../../src/domain/errors/task-access-denied.error';
import { InvalidTaskDataError } from '../../src/domain/errors/invalid-task-data.error';

describe('Task entity', () => {
  it('creates a task with default status, priority and visibility', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Write unit tests' });
    const primitives = task.toPrimitives();

    expect(primitives.status).toBe('BACKLOG');
    expect(primitives.priority).toBe('MEDIUM');
    expect(primitives.visibility).toBe('PRIVATE');
    expect(primitives.archived).toBe(false);
    expect(primitives.completedAt).toBeUndefined();
  });

  it('rejects an empty title', () => {
    expect(() => Task.create({ ownerId: 'owner-1', title: '   ' })).toThrow(InvalidTaskDataError);
  });

  it('sets completedAt when status transitions to COMPLETED', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Ship feature' });
    const changes = task.update({ title: 'Ship feature', status: 'COMPLETED' });

    expect(task.getStatus().isCompleted()).toBe(true);
    expect(task.toPrimitives().completedAt).toBeInstanceOf(Date);
    expect(changes.some((change) => change.fieldName === 'status')).toBe(true);
  });

  it('clears completedAt when status transitions away from COMPLETED', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Ship feature', status: 'COMPLETED' });
    task.update({ title: 'Ship feature', status: 'IN_PROGRESS' });

    expect(task.toPrimitives().completedAt).toBeUndefined();
  });

  it('allows the owner to modify the task', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task' });
    expect(() => task.ensureCanBeModifiedBy('owner-1', [])).not.toThrow();
  });

  it('allows an admin to modify a task owned by someone else', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task' });
    expect(() => task.ensureCanBeModifiedBy('other-user', ['ADMIN'])).not.toThrow();
  });

  it('denies modification to a non-owner, non-admin user', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task' });
    expect(() => task.ensureCanBeModifiedBy('other-user', [])).toThrow(TaskAccessDeniedError);
  });

  it('denies deletion to a non-owner, non-admin user', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task' });
    expect(() => task.ensureCanBeDeletedBy('other-user', [])).toThrow(TaskAccessDeniedError);
  });

  it('restricts viewing of PRIVATE tasks to owner or admin', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task', visibility: 'PRIVATE' });
    expect(() => task.ensureCanBeViewedBy('other-user', [])).toThrow(TaskAccessDeniedError);
    expect(() => task.ensureCanBeViewedBy('owner-1', [])).not.toThrow();
  });

  it('allows viewing of SHARED tasks by any authenticated user', () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task', visibility: 'SHARED' });
    expect(() => task.ensureCanBeViewedBy('other-user', [])).not.toThrow();
  });
});
