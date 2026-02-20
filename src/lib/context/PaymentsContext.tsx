"use client";

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from "react";
import { mockPayments } from "@/lib/mock-data/payments";
import { Payment, PaymentStatus, PaymentType } from "@/types/payment";

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: PaymentStatus | "all";
  typeFilter: PaymentType | "all";
  currentPage: number;
  itemsPerPage: number;
}

type PaymentsAction =
  | { type: "SET_PAYMENTS"; payload: Payment[] }
  | { type: "ADD_PAYMENT"; payload: Payment }
  | { type: "UPDATE_PAYMENT"; payload: Payment }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: PaymentStatus | "all" }
  | { type: "SET_TYPE_FILTER"; payload: PaymentType | "all" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "UPDATE_PAYMENT_STATUS"; payload: { paymentId: string; status: PaymentStatus } };

const initialState: PaymentsState = {
  payments: mockPayments,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
  typeFilter: "all",
  currentPage: 1,
  itemsPerPage: 10,
};

function paymentsReducer(state: PaymentsState, action: PaymentsAction): PaymentsState {
  switch (action.type) {
    case "SET_PAYMENTS":
      return { ...state, payments: action.payload };
    case "ADD_PAYMENT":
      return { ...state, payments: [action.payload, ...state.payments] };
    case "UPDATE_PAYMENT":
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, currentPage: 1 };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload, currentPage: 1 };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "UPDATE_PAYMENT_STATUS":
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.payload.paymentId
            ? { ...p, status: action.payload.status, updatedAt: new Date().toISOString() }
            : p
        ),
      };
    default:
      return state;
  }
}

interface PaymentsContextType {
  state: PaymentsState;
  dispatch: React.Dispatch<PaymentsAction>;
  getFilteredPayments: () => Payment[];
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByAccountId: (accountId: string) => Payment[];
  getTotalPages: () => number;
  executePayment: (id: string) => void;
  failPayment: (id: string) => void;
  returnPayment: (id: string) => void;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(paymentsReducer, initialState);

  const getFilteredPayments = useMemo((): (() => Payment[]) => {
    return (): Payment[] => {
      let filtered = [...state.payments];

      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.reference?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.externalId?.toLowerCase().includes(query) ||
            p.toName?.toLowerCase().includes(query)
        );
      }

      if (state.statusFilter !== "all") {
        filtered = filtered.filter((p) => p.status === state.statusFilter);
      }

      if (state.typeFilter !== "all") {
        filtered = filtered.filter((p) => p.type === state.typeFilter);
      }

      return filtered;
    };
  }, [state.payments, state.searchQuery, state.statusFilter, state.typeFilter]);

  const getPaymentById = (id: string): Payment | undefined => {
    return state.payments.find((p) => p.id === id);
  };

  const getPaymentsByAccountId = (accountId: string): Payment[] => {
    return state.payments.filter((p) => p.fromAccountId === accountId);
  };

  const getTotalPages = (): number => {
    return Math.ceil(getFilteredPayments().length / state.itemsPerPage);
  };

  const executePayment = (id: string) => {
    dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: { paymentId: id, status: "settled" } });
  };

  const failPayment = (id: string) => {
    dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: { paymentId: id, status: "failed" } });
  };

  const returnPayment = (id: string) => {
    dispatch({ type: "UPDATE_PAYMENT_STATUS", payload: { paymentId: id, status: "pending" } });
  };

  return (
    <PaymentsContext.Provider
      value={{
        state,
        dispatch,
        getFilteredPayments,
        getPaymentById,
        getPaymentsByAccountId,
        getTotalPages,
        executePayment,
        failPayment,
        returnPayment,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }
  return context;
}
