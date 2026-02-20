export type StatementType = 'balance_history' | 'transactions' | 'account';
export type StatementFormat = 'csv' | 'pdf';
export type TransactionTypeFilter = 'all' | 'transfer' | 'fx' | 'local';

export interface StatementDownload {
  id: string;
  type: StatementType;
  format: StatementFormat;
  accountName: string;
  accountId: string;
  dateRange?: { from: Date; to: Date };
  transactionTypes?: TransactionTypeFilter[];
  month?: number;
  year?: number;
  generatedAt: string;
  filename: string;
}

export interface BalanceHistoryFormData {
  accountId: string;
  dateFrom: Date;
  dateTo: Date;
  format: StatementFormat;
}

export interface TransactionsStatementFormData {
  accountId: string;
  dateFrom: Date;
  dateTo: Date;
  transactionTypes: TransactionTypeFilter[];
  format: StatementFormat;
}

export interface AccountStatementFormData {
  accountId: string;
  month: number;
  year: number;
}
