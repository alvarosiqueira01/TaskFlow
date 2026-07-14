import { eq } from 'drizzle-orm';
import { CategoryRepository } from '../../domain/repositories/category.repository.js';
import { Category } from '../../domain/entities/category.entity.js';
import { DrizzleClient } from '../database/drizzle/client.js';
import { categoriesTable } from '../database/drizzle/schema.js';

export class DrizzleCategoryRepository implements CategoryRepository {
  constructor(private readonly db: DrizzleClient) {}

  async save(category: Category): Promise<void> {
    const primitives = category.toPrimitives();
    await this.db
      .insert(categoriesTable)
      .values({
        id: primitives.id,
        name: primitives.name,
        description: primitives.description,
        color: primitives.color,
        createdBy: primitives.createdBy,
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      })
      .onConflictDoUpdate({
        target: categoriesTable.id,
        set: {
          name: primitives.name,
          description: primitives.description,
          color: primitives.color,
          updatedAt: primitives.updatedAt ?? new Date(),
        },
      });
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.db.select().from(categoriesTable);
    return rows.map((row) => Category.restore(row));
  }

  async findById(categoryId: string): Promise<Category | null> {
    const rows = await this.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1);

    if (rows.length === 0) return null;
    return Category.restore(rows[0]);
  }
}
