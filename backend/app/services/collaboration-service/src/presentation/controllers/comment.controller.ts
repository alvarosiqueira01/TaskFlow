import { FastifyReply } from 'fastify';
import { AuthenticatedRequest } from '../middleware/authenticate.middleware.js';
import { AddTaskCommentUseCase } from '../../application/use-cases/add-task-comment.use-case.js';
import { GetTaskCommentsUseCase } from '../../application/use-cases/get-task-comments.use-case.js';
import { CommentMapper } from '../../contracts/mappers/comment.mapper.js';
import { CommentInput } from '../../schemas/comment.schema.js';
import { PaginationQuery } from '../../schemas/pagination.schema.js';
import { HTTP_STATUS } from '../../config/constants.js';

export class CommentController {
  constructor(
    private readonly addTaskCommentUseCase: AddTaskCommentUseCase,
    private readonly getTaskCommentsUseCase: GetTaskCommentsUseCase,
  ) {}

  async list(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: taskId } = request.params as { id: string };
    const { limit, cursor } = request.query as PaginationQuery;

    const page = await this.getTaskCommentsUseCase.execute({ taskId, limit, cursor });

    await reply.status(HTTP_STATUS.OK).send({
      limit,
      nextCursor: page.nextCursor,
      items: page.items.map((comment) => CommentMapper.toResponse(comment)),
    });
  }

  async create(request: AuthenticatedRequest, reply: FastifyReply): Promise<void> {
    const { id: taskId } = request.params as { id: string };
    const body = request.body as CommentInput;
    const user = request.user!;

    const comment = await this.addTaskCommentUseCase.execute({
      taskId,
      userId: user.id,
      content: body.content,
      parentCommentId: body.parentCommentId,
      mentions: body.mentions,
    });

    await reply.status(HTTP_STATUS.CREATED).send(CommentMapper.toResponse(comment));
  }
}
