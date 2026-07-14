import { TaskProjection } from '../../src/domain/entities/task-projection.entity.js';

describe('TaskProjection entity', () => {
  it('creates a non-completed projection with zeroed counters', () => {
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'TODO',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });

    const primitives = taskProjection.toPrimitives();
    expect(primitives.status.toString()).toBe('TODO');
    expect(primitives.completedAt).toBeNull();
    expect(primitives.commentsCount).toBe(0);
    expect(primitives.mediaCount).toBe(0);
  });

  it('sets completedAt at creation time when the initial status is COMPLETED', () => {
    const createdAt = new Date('2026-01-01T00:00:00Z');
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'COMPLETED',
      createdAt,
    });

    expect(taskProjection.completedAt).toEqual(createdAt);
  });

  it('applies partial updates without touching omitted fields', () => {
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'TODO',
      priority: 'LOW',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });

    taskProjection.applyUpdate({ status: 'IN_PROGRESS', updatedAt: new Date('2026-01-02T00:00:00Z') });

    const primitives = taskProjection.toPrimitives();
    expect(primitives.status.toString()).toBe('IN_PROGRESS');
    expect(primitives.priority).toBe('LOW');
    expect(primitives.title).toBe('Fix bug');
  });

  it('marks the task as completed and stamps completedAt', () => {
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'REVIEW',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });

    const completedAt = new Date('2026-01-05T00:00:00Z');
    taskProjection.markCompleted(completedAt);

    expect(taskProjection.status.isCompleted()).toBe(true);
    expect(taskProjection.completedAt).toEqual(completedAt);
  });

  it('increments and decrements media count without going negative', () => {
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'TODO',
      createdAt: new Date(),
    });

    taskProjection.decrementMediaCount();
    expect(taskProjection.toPrimitives().mediaCount).toBe(0);

    taskProjection.incrementMediaCount();
    taskProjection.incrementMediaCount();
    taskProjection.decrementMediaCount();
    expect(taskProjection.toPrimitives().mediaCount).toBe(1);
  });

  it('detects overdue tasks correctly', () => {
    const taskProjection = TaskProjection.create({
      id: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'TODO',
      dueDate: new Date('2020-01-01T00:00:00Z'),
      createdAt: new Date('2019-01-01T00:00:00Z'),
    });

    expect(taskProjection.isOverdue(new Date())).toBe(true);

    taskProjection.markCompleted(new Date());
    expect(taskProjection.isOverdue(new Date())).toBe(false);
  });
});
