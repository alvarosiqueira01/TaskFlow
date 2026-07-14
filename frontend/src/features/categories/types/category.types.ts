export interface CategoryInput {
  name: string;
  description?: string;
  color?: string;
}

export interface Category extends CategoryInput {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}
