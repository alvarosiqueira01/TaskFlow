import { ListCategoriesUseCase } from '../../src/application/use-cases/list-categories.use-case.js';
import { Category } from '../../src/domain/entities/category.entity.js';

describe('ListCategoriesUseCase', () => {
  it('returns all categories from the repository', async () => {
    const categories = [
      Category.create({ name: 'Bugs', createdBy: 'user-1' }),
      Category.create({ name: 'Features', createdBy: 'user-1' }),
    ];

    const categoryRepository = { save: jest.fn(), findAll: jest.fn().mockResolvedValue(categories), findById: jest.fn() };

    const useCase = new ListCategoriesUseCase(categoryRepository as any);
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns an empty array when there are no categories', async () => {
    const categoryRepository = { save: jest.fn(), findAll: jest.fn().mockResolvedValue([]), findById: jest.fn() };

    const useCase = new ListCategoriesUseCase(categoryRepository as any);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
