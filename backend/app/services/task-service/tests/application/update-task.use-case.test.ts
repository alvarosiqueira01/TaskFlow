import { UpdateTaskUseCase } from '../../src/application/use-cases/update-task.use-case';
import { Task } from '../../src/domain/entities/task.entity';
import { TaskRepository } from '../../src/domain/repositories/task.repository';
import { TaskHistoryRepository } from '../../src/domain/repositories/task-history.repository';
import { EventPublisher } from '../../src/domain/events/event-publisher';
import { TaskNotFoundError } from '../../src/domain/errors/task-not-found.error';
import { TaskAccessDeniedError } from '../../src/domain/errors/task-access-denied.error';

describe('UpdateTaskUseCase', () => {
  const buildDeps = (existingTask: Task | null) => {
    const taskRepository: TaskRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(existingTask),
      findMany: jest.fn(),
      delete: jest.fn(),
    };
    const taskHistoryRepository: TaskHistoryRepository = {
      append: jest.fn().mockResolvedValue(undefined),
      appendMany: jest.fn().mockResolvedValue(undefined),
      findByTaskId: jest.fn(),
    };
    const eventPublisher: EventPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
      publishMany: jest.fn().mockResolvedValue(undefined),
    };
    return { taskRepository, taskHistoryRepository, eventPublisher };
  };

  it('throws TaskNotFoundError when the task does not exist', async () => {
    const { taskRepository, taskHistoryRepository, eventPublisher } = buildDeps(null);
    const useCase = new UpdateTaskUseCase(taskRepository, taskHistoryRepository, eventPublisher);

    await expect(
      useCase.execute({
        taskId: 'missing-id',
        requesterId: 'owner-1',
        requesterRoles: [],
        data: { title: 'Updated' },
      }),
    ).rejects.toThrow(TaskNotFoundError);
  });

  it('throws TaskAccessDeniedError when requester is not owner nor admin', async () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Original' });
    const { taskRepository, taskHistoryRepository, eventPublisher } = buildDeps(task);
    const useCase = new UpdateTaskUseCase(taskRepository, taskHistoryRepository, eventPublisher);

    await expect(
      useCase.execute({
        taskId: task.getId(),
        requesterId: 'intruder',
        requesterRoles: [],
        data: { title: 'Hacked title' },
      }),
    ).rejects.toThrow(TaskAccessDeniedError);
  });

  it('updates the task, records history and publishes TaskUpdated', async () => {
    const task = Task.create({ ownerId: 'owner-1', title: 'Original' });
    const { taskRepository, taskHistoryRepository, eventPublisher } = buildDeps(task);
    const useCase = new UpdateTaskUseCase(taskRepository, taskHistoryRepository, eventPublisher);

    const result = await useCase.execute({
      taskId: task.getId(),
      requesterId: 'owner-1',
      requesterRoles: [],
      data: { title: 'Updated title', priority: 'HIGH' },
    });

    expect(result.title).toBe('Updated title');
    expect(result.priority).toBe('HIGH');
    expect(taskRepository.save).toHaveBeenCalledTimes(1);
    expect(taskHistoryRepository.appendMany).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'TaskUpdated' }),
    );
  });
});
