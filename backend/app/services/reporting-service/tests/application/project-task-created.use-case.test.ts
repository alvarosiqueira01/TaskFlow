import { ProjectTaskCreatedUseCase } from '../../src/application/use-cases/project-task-created.use-case.js';

describe('ProjectTaskCreatedUseCase', () => {
  it('projects a TaskCreated event into the local read model', async () => {
    const taskProjectionRepository = { upsert: jest.fn(), findById: jest.fn() } as any;
    const useCase = new ProjectTaskCreatedUseCase(taskProjectionRepository);

    await useCase.execute({
      taskId: 'task-1',
      ownerId: 'owner-1',
      title: 'Fix bug',
      status: 'TODO',
      priority: 'HIGH',
      categoryId: 'category-1',
      dueDate: '2026-02-01T00:00:00Z',
      createdAt: '2026-01-01T00:00:00Z',
    });

    expect(taskProjectionRepository.upsert).toHaveBeenCalledTimes(1);
    const projected = taskProjectionRepository.upsert.mock.calls[0][0];
    const primitives = projected.toPrimitives();

    expect(primitives.id).toBe('task-1');
    expect(primitives.ownerId).toBe('owner-1');
    expect(primitives.priority).toBe('HIGH');
    expect(primitives.categoryId).toBe('category-1');
    expect(primitives.status.toString()).toBe('TODO');
  });
});
