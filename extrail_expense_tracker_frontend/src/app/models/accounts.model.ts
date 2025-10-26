export enum AccountType {
  cash = 'cash',
  card = 'card',
  bank = 'bank',
}

export interface AccountsModel {
  accountId?: number;
  userId: number; // derived from backend entity
  archived?: boolean;
  accountType: AccountType;
  accountName: string;
  accountBalance: number;
  createdAt?: string;
}
