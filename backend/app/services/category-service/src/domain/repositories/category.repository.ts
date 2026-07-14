import { Category } from '../entities/category.entity.js';

export interface CategoryRepository {
  save(category: Category): Promise<void>;
  findAll(): Promise<Category[]>;
  findById(categoryId: string): Promise<Category | null>;
}
