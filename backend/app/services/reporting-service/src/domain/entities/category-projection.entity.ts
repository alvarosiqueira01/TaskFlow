/**
 * Local read projection of a Category, built from CategoryCreated events.
 * Retained for future category-scoped reporting (per arquitecture.md
 * "Category Reports" responsibility); no swagger endpoint currently
 * exposes it directly.
 */
export interface CategoryProjectionProps {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
}

export class CategoryProjection {
  private constructor(private props: CategoryProjectionProps) {}

  static create(props: CategoryProjectionProps): CategoryProjection {
    return new CategoryProjection(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  toPrimitives(): CategoryProjectionProps {
    return { ...this.props };
  }
}
