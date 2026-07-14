export class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EmptyCategoryNameError extends DomainException {
  constructor() {
    super('Category name must not be empty', 'EMPTY_CATEGORY_NAME');
  }
}

export class CategoryNameTooLongError extends DomainException {
  constructor(maxLength: number) {
    super(`Category name must not exceed ${maxLength} characters`, 'CATEGORY_NAME_TOO_LONG');
  }
}

export class ForbiddenCategoryManagementError extends DomainException {
  constructor() {
    super('Only administrators or project managers may manage categories', 'FORBIDDEN_CATEGORY_MANAGEMENT');
  }
}

export class CategoryNotFoundError extends DomainException {
  constructor(categoryId: string) {
    super(`Category ${categoryId} was not found`, 'CATEGORY_NOT_FOUND');
  }
}
