export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
