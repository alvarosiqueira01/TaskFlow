import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case.js';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case.js';
import { CategoryMapper } from '../../contracts/mappers/category.mapper.js';
import { CategoryInput } from '../../schemas/category.schema.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

  async list(_request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const categories = await this.listCategoriesUseCase.execute();
    await reply.status(HTTP_STATUS.OK).send(categories.map((category) => CategoryMapper.toResponse(category)));
  }

  async create(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as CategoryInput;
    const user = request.user!;

    const category = await this.createCategoryUseCase.execute({
      name: body.name,
      description: body.description,
      color: body.color,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    await reply.status(HTTP_STATUS.CREATED).send(CategoryMapper.toResponse(category));
  }
}
