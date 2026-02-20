"use client";

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from "react";

// Types
export type PaymentStatus = "pending" | "approved" | "rejected" | "settled" | "failed";
export type PaymentType = "outbound" | "internal" | "exchange";
export type TransactionDirection = "inbound" | "outbound";
export type TransactionTypeFilter = PaymentType | "all";

interface TransactionDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: number;
}

export interface Transaction {
  id: string;
  reference: string;
  description?: string;
  externalId?: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency: string;
  direction: TransactionDirection;
  fromAccountId: string;
  toAccountId: string;
  fromAccountName?: string;
  toAccountName?: string;
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
  documents: TransactionDocument[];
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: PaymentStatus | "all";
  typeFilter: TransactionTypeFilter;
  directionFilter: TransactionDirection | "all";
  currentPage: number;
  itemsPerPage: number;
  dateRange: { start: string | null; end: string | null };
}

type DateRange = { start: string | null; end: string | null };

type TransactionsAction =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: PaymentStatus | "all" }
  | { type: "SET_TYPE_FILTER"; payload: TransactionTypeFilter }
  | { type: "SET_DIRECTION_FILTER"; payload: TransactionDirection | "all" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_DATE_RANGE"; payload: DateRange }
  | { type: "ADD_DOCUMENT"; payload: { transactionId: string; document: TransactionDocument } }
  | { type: "UPDATE_TRANSACTION_STATUS"; payload: { transactionId: string; status: PaymentStatus } };

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    reference: "TXN-2025-11-15-001",
    description: "Internal transfer to ABC Partners",
    externalId: "EXT-001",
    type: "internal",
    status: "settled",
    amount: 5234.50,
    currency: "GBP",
    direction: "outbound",
    fromAccountId: "acc-001",
    toAccountId: "acc-002",
    fromAccountName: "John Doe Inc",
    toAccountName: "ABC Partners Ltd",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
  },
  {
    id: "txn-002",
    reference: "FX-2025-11-14-042",
    description: "EUR payment from EU Supplier",
    externalId: "EXT-002",
    type: "exchange",
    status: "pending",
    amount: 3100.00,
    currency: "EUR",
    direction: "inbound",
    fromAccountId: "acc-003",
    toAccountId: "acc-001",
    fromAccountName: "EU Supplier GmbH",
    toAccountName: "John Doe Inc",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
  },
  {
    id: "txn-003",
    reference: "TXN-2025-11-13-089",
    description: "Transfer to New Ventures",
    externalId: "EXT-003",
    type: "outbound",
    status: "failed",
    amount: 15000.00,
    currency: "GBP",
    direction: "outbound",
    fromAccountId: "acc-002",
    toAccountId: "acc-004",
    fromAccountName: "ABC Partners Ltd",
    toAccountName: "New Ventures Corp",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
  },
  {
    id: "txn-004",
    reference: "LOCAL-2025-11-12-156",
    description: "Payment from Acme Manufacturing",
    externalId: "EXT-004",
    type: "outbound",
    status: "settled",
    amount: 8750.25,
    currency: "GBP",
    direction: "inbound",
    fromAccountId: "acc-005",
    toAccountId: "acc-001",
    fromAccountName: "Acme Manufacturing",
    toAccountName: "John Doe Inc",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
  },
  {
    id: "txn-005",
    reference: "TXN-2025-11-11-203",
    description: "Payment to Tech Solutions",
    externalId: "EXT-005",
    type: "outbound",
    status: "settled",
    amount: 2150.00,
    currency: "GBP",
    direction: "outbound",
    fromAccountId: "acc-001",
    toAccountId: "acc-006",
    fromAccountName: "John Doe Inc",
    toAccountName: "Tech Solutions Ltd",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
  },
];

const initialState: TransactionsState = {
  transactions: mockTransactions,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",
  directionFilter: "all",
  currentPage: 1,
  itemsPerPage: 10,
  dateRange: { start: null, end: null },
};

function transactionsReducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload, currentPage: 1 };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.payload, currentPage: 1 };
    case "SET_DIRECTION_FILTER":
      return { ...state, directionFilter: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_DATE_RANGE":
      return { ...state, dateRange: action.payload, currentPage: 1 };
    case "ADD_DOCUMENT":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.transactionId
            ? { ...t, documents: [...t.documents, action.payload.document] }
            : t
        ),
      };
    case "UPDATE_TRANSACTION_STATUS":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.transactionId
            ? { ...t, status: action.payload.status, updatedAt: new Date().toISOString() }
            : t
        ),
      };
    default:
      return state;
  }
}

interface TransactionsContextType {
  state: TransactionsState;
  dispatch: React.Dispatch<TransactionsAction>;
  getFilteredTransactions: () => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByAccountId: (accountId: string) => Transaction[];
  getTotalPages: () => number;
  executeTransaction: (id: string) => void;
  failTransaction: (id: string) => void;
  returnTransaction: (id: string) => void;
  addDocument: (transactionId: string, document: Omit<TransactionDocument, "id" | "uploadedAt">) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  const getFilteredTransactions = useMemo((): (() => Transaction[]) => {
    return (): Transaction[] => {
      let filtered = [...state.transactions];

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.reference.toLowerCase().includes(query) ||
            (t.description?.toLowerCase().includes(query) || false) ||
            (t.externalId?.toLowerCase().includes(query) || false)
        );
      }

      if (state.statusFilter !== "all") {
        filtered = filtered.filter((t) => t.status === state.statusFilter);
      }

      if (state.typeFilter !== "all") {
        filtered = filtered.filter((t) => t.type === state.typeFilter);
      }

      if (state.directionFilter !== "all") {
        filtered = filtered.filter((t) => t.direction === state.directionFilter);
      }

      return filtered;
    };
  }, [state.transactions, state.searchQuery, state.statusFilter, state.typeFilter, state.directionFilter]);

  const getTransactionById = (id: string): Transaction | undefined => {
    return state.transactions.find((t) => t.id === id);
  };

  const getTransactionsByAccountId = (accountId: string): Transaction[] => {
    return state.transactions.filter(
      (t) => t.fromAccountId === accountId || t.toAccountId === accountId
    );
  };

  const getTotalPages = (): number => {
    let filtered = [...state.transactions];
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.reference.toLowerCase().includes(query) ||
          (t.description?.toLowerCase().includes(query) || false) ||
          (t.externalId?.toLowerCase().includes(query) || false)
      );
    }
    if (state.statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === state.statusFilter);
    }
    if (state.typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === state.typeFilter);
    }
    if (state.directionFilter !== "all") {
      filtered = filtered.filter((t) => t.direction === state.directionFilter);
    }
    return Math.ceil(filtered.length / state.itemsPerPage);
  };

  const executeTransaction = (id: string) => {
    const transaction = getTransactionById(id);
    if (transaction && transaction.status === "pending") {
      const updated: Transaction = {
        ...transaction,
        status: "settled",
        settledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
    }
  };

  const failTransaction = (id: string) => {
    const transaction = getTransactionById(id);
    if (transaction && (transaction.status === "pending" || transaction.status === "approved")) {
      const updated: Transaction = {
        ...transaction,
        status: "failed",
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
    }
  };

  const returnTransaction = (id: string) => {
    const transaction = getTransactionById(id);
    if (transaction && transaction.status === "settled") {
      const updated: Transaction = {
        ...transaction,
        status: "pending",
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
    }
  };

  const addDocument = (transactionId: string, document: Omit<TransactionDocument, "id" | "uploadedAt">) => {
    const newDoc: TransactionDocument = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_DOCUMENT", payload: { transactionId, document: newDoc } });
  };

  return (
    <TransactionsContext.Provider
      value={{
        state,
        dispatch,
        getFilteredTransactions,
        getTransactionById,
        getTransactionsByAccountId,
        getTotalPages,
        executeTransaction,
        failTransaction,
        returnTransaction,
        addDocument,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
}
