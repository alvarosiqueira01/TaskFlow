import { Category } from '../../domain/entities/category.entity.js';
import { CategoryResponse } from '../dtos/category.dto.js';

export class CategoryMapper {
  static toResponse(category: Category): CategoryResponse {
    const primitives = category.toPrimitives();
    return {
      id: primitives.id,
      name: primitives.name,
      description: primitives.description ?? undefined,
      color: primitives.color ?? undefined,
      createdBy: primitives.createdBy,
      createdAt: primitives.createdAt.toISOString(),
      updatedAt: primitives.updatedAt ? primitives.updatedAt.toISOString() : undefined,
    };
  }
}
