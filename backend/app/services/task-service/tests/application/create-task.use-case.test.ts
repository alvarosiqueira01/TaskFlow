import { CreateTaskUseCase } from '../../src/application/use-cases/create-task.use-case';
import { TaskRepository } from '../../src/domain/repositories/task.repository';
import { EventPublisher } from '../../src/domain/events/event-publisher';

function buildRepositoryMock(): TaskRepository {
  return {
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  };
}

function buildPublisherMock(): EventPublisher {
  return {
    publish: jest.fn().mockResolvedValue(undefined),
    publishMany: jest.fn().mockResolvedValue(undefined),
  };
}

describe('CreateTaskUseCase', () => {
  it('creates a task, persists it, and publishes TaskCreated', async () => {
    const taskRepository = buildRepositoryMock();
    const eventPublisher = buildPublisherMock();
    const useCase = new CreateTaskUseCase(taskRepository, eventPublisher);

    const result = await useCase.execute({
      requesterId: 'owner-1',
      data: { title: 'Prepare demo' },
    });

    expect(result.title).toBe('Prepare demo');
    expect(result.ownerId).toBe('owner-1');
    expect(taskRepository.save).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'TaskCreated' }),
    );
  });

  it('publishes both TaskCreated and TaskCompleted when created already completed', async () => {
    const taskRepository = buildRepositoryMock();
    const eventPublisher = buildPublisherMock();
    const useCase = new CreateTaskUseCase(taskRepository, eventPublisher);

    await useCase.execute({
      requesterId: 'owner-1',
      data: { title: 'Retro notes', status: 'COMPLETED' },
    });

    expect(eventPublisher.publish).toHaveBeenCalledTimes(2);
  });
});
