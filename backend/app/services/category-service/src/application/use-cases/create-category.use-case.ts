import { Category } from '../../domain/entities/category.entity.js';
import { CategoryRepository } from '../../domain/repositories/category.repository.js';
import { EventPublisher } from '../../domain/events/event-publisher.port.js';
import { CategoryCreatedEvent } from '../../domain/events/category-created.event.js';
import { ForbiddenCategoryManagementError } from '../../domain/exceptions/category.exceptions.js';
import { CATEGORY_MANAGEMENT_ROLES } from '../../config/constants.js';

export interface CreateCategoryCommand {
  name: string;
  description?: string | null;
  color?: string | null;
  requesterId: string;
  requesterRoles: string[];
}

export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const isAllowed = command.requesterRoles.some((role) =>
      (CATEGORY_MANAGEMENT_ROLES as readonly string[]).includes(role),
    );
    if (!isAllowed) {
      throw new ForbiddenCategoryManagementError();
    }

    const category = Category.create({
      name: command.name,
      description: command.description,
      color: command.color,
      createdBy: command.requesterId,
    });

    await this.categoryRepository.save(category);

    await this.eventPublisher.publish(
      new CategoryCreatedEvent({
        categoryId: category.id,
        name: category.name,
        createdBy: category.createdBy,
        createdAt: category.createdAt.toISOString(),
      }),
    );

    return category;
  }
}
