import { setActivePinia, createPinia } from 'pinia';
import { useTaskComments } from './useTaskComments';
import { useCommentStore } from '../store/commentStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useTaskComments.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('computes a nested thread from a flat comment list', () => {
    const store = useCommentStore();
    const flatComments = [
      { id: '1', taskId: 't1', userId: 'u1', content: 'Root', createdAt: '2026-07-01' },
      { id: '2', taskId: 't1', userId: 'u2', content: 'Reply to Root', parentCommentId: '1', createdAt: '2026-07-02' },
      { id: '3', taskId: 't1', userId: 'u3', content: 'Another Root', createdAt: '2026-07-03' },
    ];
    
    store.buckets['t1'] = { items: flatComments, nextCursor: null, isLoading: false, isLoadingMore: false, isSubmitting: false, error: null };

    const { thread } = useTaskComments('t1', { autoLoad: false });

    expect(thread.value.length).toBe(2);
    expect(thread.value[0].id).toBe('1');
    expect(thread.value[0].replies.length).toBe(1);
    expect(thread.value[0].replies[0].id).toBe('2');
    expect(thread.value[1].id).toBe('3');
  });
});
