export type PaymentStatus = "pending" | "approved" | "rejected" | "settled" | "failed";
export type PaymentType = "outbound" | "internal" | "exchange";

export interface Payment {
  id: string;
  externalId?: string;
  status: PaymentStatus;
  type: PaymentType;
  amount: number;
  currency: string;
  fromAccountId: string;
  toAccountId?: string;
  toName?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  settledAt?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface Account {
  id: string;
  name: string;
  externalId?: string;
  status: "open" | "pending" | "closed";
  currency: string;
  availableBalance: number;
  currentBalance: number;
  isPrimary?: boolean;
  wireAccountNumber?: string;
  routingNumber?: string;
  accountOwner: string;
}
