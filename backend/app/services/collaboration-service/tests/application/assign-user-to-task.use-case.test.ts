import { AssignUserToTaskUseCase } from '../../src/application/use-cases/assign-user-to-task.use-case.js';
import { TaskReference } from '../../src/domain/entities/task-reference.entity.js';
import {
  DuplicateAssignmentError,
  ForbiddenAssignmentError,
  TaskNotFoundError,
} from '../../src/domain/exceptions/collaboration.exceptions.js';

function buildUseCase(overrides: Partial<{ taskReference: TaskReference | null; existingAssignment: unknown }> = {}) {
  const assignmentRepository = {
    save: jest.fn(),
    findByTaskAndUser: jest.fn().mockResolvedValue(overrides.existingAssignment ?? null),
    findByTaskId: jest.fn(),
    delete: jest.fn(),
  };

  const taskReferenceRepository = {
    upsert: jest.fn(),
    findById: jest.fn().mockResolvedValue(
      overrides.taskReference === undefined
        ? TaskReference.create({
            id: 'task-1',
            ownerId: 'owner-1',
            title: 'Fix bug',
            status: 'TODO',
            updatedAt: new Date(),
          })
        : overrides.taskReference,
    ),
  };

  const notificationRepository = { save: jest.fn(), saveMany: jest.fn(), findById: jest.fn(), findByUserId: jest.fn(), markAllAsRead: jest.fn() };
  const eventPublisher = { publish: jest.fn() };

  const useCase = new AssignUserToTaskUseCase(
    assignmentRepository as any,
    taskReferenceRepository as any,
    notificationRepository as any,
    eventPublisher as any,
  );

  return { useCase, assignmentRepository, taskReferenceRepository, notificationRepository, eventPublisher };
}

describe('AssignUserToTaskUseCase', () => {
  it('assigns a user, creates a notification and publishes TaskAssigned', async () => {
    const { useCase, assignmentRepository, notificationRepository, eventPublisher } = buildUseCase();

    const result = await useCase.execute({
      taskId: 'task-1',
      userId: 'user-2',
      requesterId: 'owner-1',
      requesterRoles: [],
    });

    expect(result.taskId).toBe('task-1');
    expect(assignmentRepository.save).toHaveBeenCalledTimes(1);
    expect(notificationRepository.save).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
  });

  it('throws TaskNotFoundError when task reference does not exist', async () => {
    const { useCase } = buildUseCase({ taskReference: null });

    await expect(
      useCase.execute({ taskId: 'missing', userId: 'user-2', requesterId: 'owner-1', requesterRoles: [] }),
    ).rejects.toThrow(TaskNotFoundError);
  });

  it('throws ForbiddenAssignmentError when requester is neither owner nor privileged', async () => {
    const { useCase } = buildUseCase();

    await expect(
      useCase.execute({ taskId: 'task-1', userId: 'user-2', requesterId: 'someone-else', requesterRoles: [] }),
    ).rejects.toThrow(ForbiddenAssignmentError);
  });

  it('throws DuplicateAssignmentError when the assignment already exists', async () => {
    const { useCase } = buildUseCase({ existingAssignment: { id: 'existing' } });

    await expect(
      useCase.execute({ taskId: 'task-1', userId: 'user-2', requesterId: 'owner-1', requesterRoles: [] }),
    ).rejects.toThrow(DuplicateAssignmentError);
  });
});
