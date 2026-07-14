import { Comment } from '../../domain/entities/comment.entity.js';
import { CommentRepository } from '../../domain/repositories/comment.repository.js';
import { TaskReferenceRepository } from '../../domain/repositories/task-reference.repository.js';
import { NotificationRepository } from '../../domain/repositories/notification.repository.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { NotificationType } from '../../domain/value-objects/notification-type.vo.js';
import { EventPublisher } from '../../domain/events/event-publisher.port.js';
import { CommentCreatedEvent } from '../../domain/events/comment-created.event.js';
import { MentionCreatedEvent } from '../../domain/events/mention-created.event.js';
import {
  ParentCommentNotFoundError,
  TaskNotFoundError,
} from '../../domain/exceptions/collaboration.exceptions.js';

export interface AddTaskCommentCommand {
  taskId: string;
  userId: string;
  content: string;
  parentCommentId?: string | null;
  mentions?: string[];
}

export class AddTaskCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly taskReferenceRepository: TaskReferenceRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AddTaskCommentCommand): Promise<Comment> {
    const taskReference = await this.taskReferenceRepository.findById(command.taskId);
    if (!taskReference) {
      throw new TaskNotFoundError(command.taskId);
    }

    if (command.parentCommentId) {
      const parent = await this.commentRepository.findById(command.parentCommentId);
      if (!parent || parent.taskId !== command.taskId) {
        throw new ParentCommentNotFoundError(command.parentCommentId);
      }
    }

    const comment = Comment.create({
      taskId: command.taskId,
      userId: command.userId,
      content: command.content,
      parentCommentId: command.parentCommentId ?? null,
      mentions: command.mentions ?? [],
    });

    await this.commentRepository.save(comment);

    await this.eventPublisher.publish(
      new CommentCreatedEvent({
        commentId: comment.id,
        taskId: comment.taskId,
        userId: comment.userId,
        content: comment.content,
        parentCommentId: comment.parentCommentId,
        createdAt: comment.createdAt.toISOString(),
      }),
    );

    if (comment.hasMentions()) {
      const mentionedUsers = comment.mentions.filter((userId) => userId !== command.userId);

      const notifications = mentionedUsers.map((userId) =>
        Notification.create({
          userId,
          taskId: comment.taskId,
          commentId: comment.id,
          type: NotificationType.mention(),
          title: 'You were mentioned in a comment',
          message: `You were mentioned in a comment on task "${taskReference.title}".`,
        }),
      );

      if (notifications.length > 0) {
        await this.notificationRepository.saveMany(notifications);
      }

      for (const userId of mentionedUsers) {
        await this.eventPublisher.publish(
          new MentionCreatedEvent({
            commentId: comment.id,
            taskId: comment.taskId,
            mentionedUserId: userId,
            mentionedBy: command.userId,
            createdAt: comment.createdAt.toISOString(),
          }),
        );
      }
    }

    return comment;
  }
}
