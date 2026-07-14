import { DashboardService } from './DashboardService';
import { httpClient } from '@/core/api/http-client';
import { TASK_STATUS_VALUES } from '../types/dashboard.types';
import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/core/api/http-client');

describe('DashboardService.ts', () => {
  const service = new DashboardService();

  it('fetches status breakdowns concurrently and maps totals', async () => {
    (httpClient.get as Mock).mockImplementation((url, config) => {
      const status = config.params.status;
      const mockTotal = status === 'COMPLETED' ? 15 : 5;
      return Promise.resolve({ data: { total: mockTotal, items: [] } });
    });

    const result = await service.getStatusBreakdown();

    expect(httpClient.get).toHaveBeenCalledTimes(TASK_STATUS_VALUES.length);
    const completedItem = result.find(r => r.status === 'COMPLETED');
    const todoItem = result.find(r => r.status === 'TODO');
    
    expect(completedItem?.count).toBe(15);
    expect(todoItem?.count).toBe(5);
  });
});
