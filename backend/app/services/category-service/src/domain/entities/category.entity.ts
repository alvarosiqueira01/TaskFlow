import { randomUUID } from 'node:crypto';
import { CategoryNameTooLongError, EmptyCategoryNameError } from '../exceptions/category.exceptions.js';

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 255;
const MAX_COLOR_LENGTH = 20;

export interface CategoryProps {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Category {
  private constructor(private props: CategoryProps) {}

  static create(input: {
    name: string;
    description?: string | null;
    color?: string | null;
    createdBy: string;
  }): Category {
    const trimmedName = input.name?.trim() ?? '';
    if (trimmedName.length === 0) {
      throw new EmptyCategoryNameError();
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      throw new CategoryNameTooLongError(MAX_NAME_LENGTH);
    }

    const description = input.description?.trim().slice(0, MAX_DESCRIPTION_LENGTH) ?? null;
    const color = input.color?.trim().slice(0, MAX_COLOR_LENGTH) ?? null;

    return new Category({
      id: randomUUID(),
      name: trimmedName,
      description: description && description.length > 0 ? description : null,
      color: color && color.length > 0 ? color : null,
      createdBy: input.createdBy,
      createdAt: new Date(),
      updatedAt: null,
    });
  }

  static restore(props: CategoryProps): Category {
    return new Category(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get color(): string | null {
    return this.props.color;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }

  toPrimitives(): CategoryProps {
    return { ...this.props };
  }
}
