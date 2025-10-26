export interface BudgetsModel {
  budgetId?: number;
  userId: number;
  budgetName: string;
  limitAmount: number;
  categoryId?: number | null; // overall budget if null
  categoryName?: string | null;
  created_at?: string; // ISO timestamp from backend
}
