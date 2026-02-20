import { z } from 'zod';

export const balanceHistorySchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  dateFrom: z.date({ message: 'Start date is required' }),
  dateTo: z.date({ message: 'End date is required' }),
  format: z.enum(['csv', 'pdf']).default('csv'),
}).refine(
  (data) => data.dateFrom <= data.dateTo,
  { message: 'Start date must be before or equal to end date', path: ['dateFrom'] }
).refine(
  (data) => data.dateTo <= new Date(),
  { message: 'End date cannot be in the future', path: ['dateTo'] }
);

export const transactionsStatementSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  dateFrom: z.date({ message: 'Start date is required' }),
  dateTo: z.date({ message: 'End date is required' }),
  transactionTypes: z.array(z.enum(['all', 'transfer', 'fx', 'local'])).min(1, 'Select at least one transaction type'),
  format: z.enum(['csv', 'pdf']).default('csv'),
}).refine(
  (data) => data.dateFrom <= data.dateTo,
  { message: 'Start date must be before or equal to end date', path: ['dateFrom'] }
).refine(
  (data) => data.dateTo <= new Date(),
  { message: 'End date cannot be in the future', path: ['dateTo'] }
);

export const accountStatementSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  month: z.number().min(0).max(11),
  year: z.number().min(1900),
});

export const statementTabSchema = z.enum(['balance_history', 'transactions', 'account']);
