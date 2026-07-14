// Assumes a centralized Axios instance is exported from core/api, per
// Frontend Architecture Standard ("core/api/ - Axios instance, interceptors").
import { httpClient } from '@/core/api/http-client';
import type { Category, RawReportPayload, TaskStatus } from '../types/report.types';

/** Mirrors components.schemas.CursorPaginatedResponse (allOf items). */
interface CursorPaginatedResponseDto<T> {
  limit: number;
  nextCursor: string | null;
  total?: number;
  items: T[];
}

/** Mirrors components.schemas.Category (reduced fields). */
interface CategoryResponseDto {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export class ReportsService {
  /**
   * Reuses GET /tasks?status=X&limit=1 to derive a per-status total via
   * the optional `total` field of CursorPaginatedResponse. No dedicated
   * status-breakdown report endpoint exists in the contract.
   */
  async getTaskCountByStatus(status: TaskStatus): Promise<number> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<unknown>>('/tasks', {
      params: { status, limit: 1 },
    });
    return data.total ?? data.items.length;
  }

  /** GET /categories */
  async listCategories(): Promise<Category[]> {
    const { data } = await httpClient.get<CategoryResponseDto[]>('/categories');
    return data;
  }

  /**
   * Reuses GET /tasks?categoryId=X&limit=1 to derive a per-category total,
   * for the same reason as getTaskCountByStatus above.
   */
  async getTaskCountByCategory(categoryId: string): Promise<number> {
    const { data } = await httpClient.get<CursorPaginatedResponseDto<unknown>>('/tasks', {
      params: { categoryId, limit: 1 },
    });
    return data.total ?? data.items.length;
  }

  /**
   * GET /reports/completed?startDate&endDate
   * The contract defines no response schema for this endpoint, so the
   * payload is returned unmodified (RawReportPayload = unknown).
   */
  async getCompletedTasksReport(startDate: string, endDate: string): Promise<RawReportPayload> {
    const { data } = await httpClient.get<RawReportPayload>('/reports/completed', {
      params: { startDate, endDate },
    });
    return data;
  }

  /**
   * GET /reports/pending
   * Same schema gap as getCompletedTasksReport above.
   */
  async getPendingTasksReport(): Promise<RawReportPayload> {
    const { data } = await httpClient.get<RawReportPayload>('/reports/pending');
    return data;
  }
}

export const reportsService = new ReportsService();
