import { ListTasksUseCase } from '../../src/application/use-cases/list-tasks.use-case';
import { Task } from '../../src/domain/entities/task.entity';
import { TaskRepository } from '../../src/domain/repositories/task.repository';

describe('ListTasksUseCase', () => {
  it('scopes non-admin users to their own tasks', async () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Task' });
    const taskRepository: TaskRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn().mockResolvedValue({ items: [task], nextCursor: null, limit: 20 }),
      delete: jest.fn(),
    };
    const useCase = new ListTasksUseCase(taskRepository);

    await useCase.execute({
      requesterId: 'owner-1',
      requesterRoles: [],
      query: { limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    });

    expect(taskRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: 'owner-1' }),
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('does not scope admin users by ownerId', async () => {
    const taskRepository: TaskRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn().mockResolvedValue({ items: [], nextCursor: null, limit: 20 }),
      delete: jest.fn(),
    };
    const useCase = new ListTasksUseCase(taskRepository);

    await useCase.execute({
      requesterId: 'admin-1',
      requesterRoles: ['ADMIN'],
      query: { limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
    });

    expect(taskRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: undefined }),
      expect.any(Object),
      expect.any(Object),
    );
  });
});
