import { eq } from 'drizzle-orm';
import { CategoryProjectionRepository } from '../../domain/repositories/category-projection.repository.js';
import { CategoryProjection } from '../../domain/entities/category-projection.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { categoryProjectionsTable } from '../database/drizzle/schema.js';

export class DrizzleCategoryProjectionRepository implements CategoryProjectionRepository {
  constructor(private readonly db: DrizzleClient) {}

  async upsert(categoryProjection: CategoryProjection): Promise<void> {
    const primitives = categoryProjection.toPrimitives();
    await this.db
      .insert(categoryProjectionsTable)
      .values(primitives)
      .onConflictDoUpdate({
        target: categoryProjectionsTable.id,
        set: { name: primitives.name },
      });
  }

  async findById(categoryId: string): Promise<CategoryProjection | null> {
    const rows = await this.db
      .select()
      .from(categoryProjectionsTable)
      .where(eq(categoryProjectionsTable.id, categoryId))
      .limit(1);

    if (rows.length === 0) return null;
    return CategoryProjection.create(rows[0]);
  }
}
