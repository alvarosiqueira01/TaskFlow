import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import { taskRoutes } from '../../src/presentation/routes/task.routes';
import { TaskController } from '../../src/presentation/controllers/task.controller';
import { registerErrorHandler } from '../../src/presentation/middleware/error-handler.middleware';
import { JwtVerifier } from '../../src/infrastructure/jwt/jwt-verifier';

const JWT_SECRET = 'test-secret';

function buildToken(userId: string, roles: string[] = []): string {
  return jwt.sign({ sub: userId, roles }, JWT_SECRET, { expiresIn: '1h' });
}

function buildApp() {
  const app = Fastify();
  registerErrorHandler(app);

  const taskController = new TaskController({
    createTaskUseCase: {
      execute: jest.fn().mockResolvedValue({
        id: '11111111-1111-1111-1111-111111111111',
        ownerId: 'owner-1',
        title: 'Created task',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        visibility: 'PRIVATE',
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    } as never,
    updateTaskUseCase: { execute: jest.fn() } as never,
    deleteTaskUseCase: { execute: jest.fn().mockResolvedValue(undefined) } as never,
    getTaskUseCase: { execute: jest.fn() } as never,
    listTasksUseCase: {
      execute: jest.fn().mockResolvedValue({ items: [], limit: 20, nextCursor: null }),
    } as never,
    getTaskHistoryUseCase: { execute: jest.fn() } as never,
  });

  app.register(taskRoutes, {
    taskController,
    jwtVerifier: new JwtVerifier(JWT_SECRET),
  });

  return app;
}

describe('Task routes', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const app = buildApp();
    const response = await app.inject({ method: 'GET', url: '/tasks' });
    expect(response.statusCode).toBe(401);
  });

  it('returns 201 when creating a task with valid payload and token', async () => {
    const app = buildApp();
    const token = buildToken('owner-1');

    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: 'Created task' },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json().title).toBe('Created task');
  });

  it('returns 400 when creating a task with invalid payload', async () => {
    const app = buildApp();
    const token = buildToken('owner-1');

    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      headers: { authorization: `Bearer ${token}` },
      payload: { title: '' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns a paginated list of tasks on GET /tasks', async () => {
    const app = buildApp();
    const token = buildToken('owner-1');

    const response = await app.inject({
      method: 'GET',
      url: '/tasks',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ items: [], limit: 20, nextCursor: null });
  });
});
