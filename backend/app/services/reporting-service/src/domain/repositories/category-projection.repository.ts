import { CategoryProjection } from '../entities/category-projection.entity.js';

export interface CategoryProjectionRepository {
  upsert(categoryProjection: CategoryProjection): Promise<void>;
  findById(categoryId: string): Promise<CategoryProjection | null>;
}
