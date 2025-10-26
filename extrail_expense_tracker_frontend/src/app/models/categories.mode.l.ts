export enum CategoryType {
  income = 'income',
  expense = 'expense',
}

export enum CategoryScope {
  global = 'global',
  user = 'user',
}

export interface CategoriesModel {
  categoryId?: number;
  categoryName: string;
  description?: string;
  categoryType: CategoryType;
  scope: CategoryScope;
  ownerUserId?: number | null; // null when global
  createdAt?: string;
  updatedAt?: string;
}

// Request shapes for specific endpoints
export interface CreateUserCategoryRequest {
  categoryName: string;
  description?: string;
  categoryType: CategoryType;
  ownerUserId: number;
}

export interface CreateGlobalCategoryRequest {
  categoryName: string;
  description?: string;
  categoryType: CategoryType;
}
