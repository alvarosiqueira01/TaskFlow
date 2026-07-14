import { Comment } from '../../src/domain/entities/comment.entity.js';
import { EmptyCommentContentError } from '../../src/domain/exceptions/collaboration.exceptions.js';

describe('Comment entity', () => {
  it('creates a valid comment with trimmed content', () => {
    const comment = Comment.create({
      taskId: 'task-1',
      userId: 'user-1',
      content: '  Hello world  ',
    });

    expect(comment.content).toBe('Hello world');
    expect(comment.mentions).toEqual([]);
    expect(comment.parentCommentId).toBeNull();
  });

  it('throws EmptyCommentContentError for blank content', () => {
    expect(() =>
      Comment.create({ taskId: 'task-1', userId: 'user-1', content: '   ' }),
    ).toThrow(EmptyCommentContentError);
  });

  it('deduplicates mentions', () => {
    const comment = Comment.create({
      taskId: 'task-1',
      userId: 'user-1',
      content: 'hi',
      mentions: ['u-2', 'u-2', 'u-3'],
    });

    expect(comment.mentions.sort()).toEqual(['u-2', 'u-3']);
    expect(comment.hasMentions()).toBe(true);
  });
});
