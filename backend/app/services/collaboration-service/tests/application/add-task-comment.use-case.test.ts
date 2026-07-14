import { AddTaskCommentUseCase } from '../../src/application/use-cases/add-task-comment.use-case.js';
import { TaskReference } from '../../src/domain/entities/task-reference.entity.js';
import { TaskNotFoundError } from '../../src/domain/exceptions/collaboration.exceptions.js';

function buildUseCase() {
  const commentRepository = { save: jest.fn(), findById: jest.fn().mockResolvedValue(null), findByTaskId: jest.fn() };
  const taskReferenceRepository = {
    upsert: jest.fn(),
    findById: jest.fn().mockResolvedValue(
      TaskReference.create({ id: 'task-1', ownerId: 'owner-1', title: 'Fix bug', status: 'TODO', updatedAt: new Date() }),
    ),
  };
  const notificationRepository = { save: jest.fn(), saveMany: jest.fn(), findById: jest.fn(), findByUserId: jest.fn(), markAllAsRead: jest.fn() };
  const eventPublisher = { publish: jest.fn() };

  const useCase = new AddTaskCommentUseCase(
    commentRepository as any,
    taskReferenceRepository as any,
    notificationRepository as any,
    eventPublisher as any,
  );

  return { useCase, commentRepository, notificationRepository, eventPublisher };
}

describe('AddTaskCommentUseCase', () => {
  it('creates a comment and publishes CommentCreated', async () => {
    const { useCase, commentRepository, eventPublisher } = buildUseCase();

    const comment = await useCase.execute({ taskId: 'task-1', userId: 'user-1', content: 'hello' });

    expect(comment.content).toBe('hello');
    expect(commentRepository.save).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({ eventName: 'CommentCreated' }));
  });

  it('creates mention notifications and publishes MentionCreated per mentioned user', async () => {
    const { useCase, notificationRepository, eventPublisher } = buildUseCase();

    await useCase.execute({
      taskId: 'task-1',
      userId: 'user-1',
      content: 'hey @user-2 @user-3',
      mentions: ['user-2', 'user-3', 'user-1'],
    });

    expect(notificationRepository.saveMany).toHaveBeenCalledTimes(1);
    const mentionEvents = eventPublisher.publish.mock.calls.filter(
      ([event]) => event.eventName === 'MentionCreated',
    );
    expect(mentionEvents).toHaveLength(2);
  });

  it('throws TaskNotFoundError when the task reference is missing', async () => {
    const { useCase } = buildUseCase();
    (useCase as any).taskReferenceRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(useCase.execute({ taskId: 'missing', userId: 'user-1', content: 'hi' })).rejects.toThrow(
      TaskNotFoundError,
    );
  });
});
