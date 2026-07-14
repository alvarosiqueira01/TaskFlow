import { createTaskSchema } from '../../src/schemas/create-task.schema';
import { listTasksQuerySchema } from '../../src/schemas/list-tasks-query.schema';

/**
 * Contract validation tests ensuring the Zod schemas remain aligned with the
 * TaskInput and query parameter definitions in the OpenAPI specification (_A6_swagger.yaml).
 */
describe('Task contracts (OpenAPI alignment)', () => {
  it('accepts a minimal valid TaskInput payload (title only)', () => {
    const result = createTaskSchema.safeParse({ title: 'Minimal task' });
    expect(result.success).toBe(true);
  });

  it('rejects a TaskInput payload without a title', () => {
    const result = createTaskSchema.safeParse({ description: 'No title provided' });
    expect(result.success).toBe(false);
  });

  it('rejects a title longer than 200 characters, per swagger maxLength', () => {
    const result = createTaskSchema.safeParse({ title: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid TaskStatus enum value', () => {
    const result = createTaskSchema.safeParse({ title: 'Task', status: 'UNKNOWN' });
    expect(result.success).toBe(false);
  });

  it('applies default pagination limit and sort as defined in swagger parameters', () => {
    const result = listTasksQuerySchema.parse({});
    expect(result.limit).toBe(20);
    expect(result.sortBy).toBe('createdAt');
    expect(result.sortOrder).toBe('desc');
  });

  it('rejects a page limit above the swagger-defined maximum of 100', () => {
    const result = listTasksQuerySchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });
});
