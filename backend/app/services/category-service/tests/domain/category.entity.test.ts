import { Category } from '../../src/domain/entities/category.entity.js';
import { CategoryNameTooLongError, EmptyCategoryNameError } from '../../src/domain/exceptions/category.exceptions.js';

describe('Category entity', () => {
  it('creates a valid category with trimmed fields', () => {
    const category = Category.create({
      name: '  Bugs  ',
      description: '  Bug reports  ',
      color: ' #FF0000 ',
      createdBy: 'user-1',
    });

    expect(category.name).toBe('Bugs');
    expect(category.description).toBe('Bug reports');
    expect(category.color).toBe('#FF0000');
    expect(category.createdBy).toBe('user-1');
    expect(category.updatedAt).toBeNull();
  });

  it('normalizes empty optional fields to null', () => {
    const category = Category.create({ name: 'Bugs', description: '   ', color: '   ', createdBy: 'user-1' });

    expect(category.description).toBeNull();
    expect(category.color).toBeNull();
  });

  it('throws EmptyCategoryNameError for blank name', () => {
    expect(() => Category.create({ name: '   ', createdBy: 'user-1' })).toThrow(EmptyCategoryNameError);
  });

  it('throws CategoryNameTooLongError when name exceeds 100 characters', () => {
    const longName = 'a'.repeat(101);
    expect(() => Category.create({ name: longName, createdBy: 'user-1' })).toThrow(CategoryNameTooLongError);
  });
});
