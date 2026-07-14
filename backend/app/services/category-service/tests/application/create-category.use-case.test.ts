import { CreateCategoryUseCase } from '../../src/application/use-cases/create-category.use-case.js';
import { ForbiddenCategoryManagementError } from '../../src/domain/exceptions/category.exceptions.js';

function buildUseCase() {
  const categoryRepository = { save: jest.fn(), findAll: jest.fn(), findById: jest.fn() };
  const eventPublisher = { publish: jest.fn() };

  const useCase = new CreateCategoryUseCase(categoryRepository as any, eventPublisher as any);

  return { useCase, categoryRepository, eventPublisher };
}

describe('CreateCategoryUseCase', () => {
  it('creates a category and publishes CategoryCreated when requester is a Project Manager', async () => {
    const { useCase, categoryRepository, eventPublisher } = buildUseCase();

    const category = await useCase.execute({
      name: 'Bugs',
      requesterId: 'user-1',
      requesterRoles: ['PROJECT_MANAGER'],
    });

    expect(category.name).toBe('Bugs');
    expect(categoryRepository.save).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publish).toHaveBeenCalledWith(expect.objectContaining({ eventName: 'CategoryCreated' }));
  });

  it('creates a category when requester is an Administrator', async () => {
    const { useCase, categoryRepository } = buildUseCase();

    await useCase.execute({ name: 'Features', requesterId: 'admin-1', requesterRoles: ['ADMINISTRATOR'] });

    expect(categoryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('throws ForbiddenCategoryManagementError for requesters without the required roles', async () => {
    const { useCase } = buildUseCase();

    await expect(
      useCase.execute({ name: 'Bugs', requesterId: 'user-1', requesterRoles: ['TEAM_MEMBER'] }),
    ).rejects.toThrow(ForbiddenCategoryManagementError);
  });
});
