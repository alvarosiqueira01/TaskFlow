import { z } from 'zod';

export const completedTasksReportQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export type CompletedTasksReportQuery = z.infer<typeof completedTasksReportQuerySchema>;
