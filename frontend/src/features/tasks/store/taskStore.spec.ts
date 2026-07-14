import { setActivePinia, createPinia } from 'pinia';
import { useTaskStore } from './taskStore';
import { TaskService } from '../services/TaskService';
import type { TaskStatus, TaskPriority, TaskVisibility } from '../types/task.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../services/TaskService');

describe('taskStore.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('updates task status locally upon successful API response', async () => {
    const store = useTaskStore();
    const initialTask = { id: 'task-1', 
      ownerId: '1', 
      title: 'Test Task',
      assignedUsers: [],
      completedAt: undefined,
      description: 'A task for testing',
      categoryId: 'cat-1',
      priority: 'MEDIUM' as TaskPriority,
      visibility: 'PRIVATE' as TaskVisibility,
      dueDate: '2026-12-31',
      archived: false,
      status: 'TODO' as TaskStatus, 
      createdAt: '2026', 
      updatedAt: '2026' };

    store.tasks = [initialTask];

    const updatedTask = { ...initialTask, status: 'COMPLETED' };
    (TaskService.updateTask as Mock).mockResolvedValue(updatedTask);

    await store.updateTaskStatus('task-1', 'COMPLETED');

    expect(TaskService.updateTask).toHaveBeenCalledWith('task-1', expect.objectContaining({ status: 'COMPLETED' }));
    expect(store.tasks[0].status).toBe('COMPLETED');
    expect(store.tasks.length).toBe(1);
  });
});
