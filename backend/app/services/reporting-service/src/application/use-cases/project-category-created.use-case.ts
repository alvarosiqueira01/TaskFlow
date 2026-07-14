import { CategoryProjection } from '../../domain/entities/category-projection.entity.js';
import { CategoryProjectionRepository } from '../../domain/repositories/category-projection.repository.js';
import { CategoryCreatedEventPayload } from '../../events/consumed/category-created.event-schema.js';

export class ProjectCategoryCreatedUseCase {
  constructor(private readonly categoryProjectionRepository: CategoryProjectionRepository) {}

  async execute(payload: CategoryCreatedEventPayload): Promise<void> {
    const categoryProjection = CategoryProjection.create({
      id: payload.categoryId,
      name: payload.name,
      createdBy: payload.createdBy,
      createdAt: new Date(payload.createdAt),
    });

    await this.categoryProjectionRepository.upsert(categoryProjection);
  }
}
