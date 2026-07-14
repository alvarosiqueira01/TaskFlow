import { createDrizzleClient, DrizzleClient } from '../../src/infrastructure/database/drizzle/client';
import { DrizzleTaskRepository } from '../../src/infrastructure/repositories/drizzle-task.repository';
import { Task } from '../../src/domain/entities/task.entity';

/**
 * Integration test against a real PostgreSQL instance (local database or LocalStack-backed RDS).
 * Skipped automatically when TEST_DATABASE_URL is not provided, per the testing-strategy.md
 * separation between fast unit tests and infrastructure integration tests.
 */
const connectionString = process.env.TEST_DATABASE_URL;
const describeIfDb = connectionString ? describe : describe.skip;

describeIfDb('DrizzleTaskRepository (integration)', () => {
  let db: DrizzleClient;
  let dispose: () => Promise<void>;
  let repository: DrizzleTaskRepository;

  beforeAll(() => {
    const client = createDrizzleClient(connectionString as string);
    db = client.db;
    dispose = async () => client.pool.end();
    repository = new DrizzleTaskRepository(db);
  });

  afterAll(async () => {
    await dispose();
  });

  it('persists and retrieves a task by id', async () => {
    const task = Task.create({ ownerId: 'owner-int-test', title: 'Integration task' });

    await repository.save(task);
    const found = await repository.findById(task.getId());

    expect(found).not.toBeNull();
    expect(found?.getId()).toBe(task.getId());

    await repository.delete(task.getId());
    const afterDelete = await repository.findById(task.getId());
    expect(afterDelete).toBeNull();
  });
});
