export enum TxType {
  income = 'income',
  expense = 'expense',
}

export interface TransactionsModel {
  transactionId?: number;
  userId: number;
  transferGroupId?: string | null;
  accountId: number;
  amount: number;
  transactionType: TxType;
  description?: string;
  date: string; // ISO datetime string
  categoryId: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}
