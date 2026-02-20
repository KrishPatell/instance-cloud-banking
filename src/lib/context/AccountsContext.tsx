"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { mockAccounts, Account } from "@/lib/mock-data/accounts";

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: "all" | "open" | "pending";
}

type AccountsAction =
  | { type: "SET_ACCOUNTS"; payload: Account[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: "all" | "open" | "pending" };

const initialState: AccountsState = {
  accounts: mockAccounts,
  loading: false,
  error: null,
  searchQuery: "",
  statusFilter: "all",
};

function accountsReducer(state: AccountsState, action: AccountsAction): AccountsState {
  switch (action.type) {
    case "SET_ACCOUNTS":
      return { ...state, accounts: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_ACCOUNT":
      return { ...state, accounts: [...state.accounts, action.payload] };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.map((acc) =>
          acc.id === action.payload.id ? action.payload : acc
        ),
      };
    case "DELETE_ACCOUNT":
      return {
        ...state,
        accounts: state.accounts.filter((acc) => acc.id !== action.payload),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload };
    default:
      return state;
  }
}

interface AccountsContextType {
  state: AccountsState;
  dispatch: React.Dispatch<AccountsAction>;
  getFilteredAccounts: () => Account[];
  getAccountById: (id: string) => Account | undefined;
  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accountsReducer, initialState);

  const getFilteredAccounts = (): Account[] => {
    let filtered = [...state.accounts];

    // Apply status filter
    if (state.statusFilter !== "all") {
      filtered = filtered.filter((acc) => acc.status === state.statusFilter);
    }

    // Apply search filter
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (acc) =>
          acc.name.toLowerCase().includes(query) ||
          acc.externalId.toLowerCase().includes(query) ||
          acc.accountOwner.toLowerCase().includes(query) ||
          acc.currency.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getAccountById = (id: string): Account | undefined => {
    return state.accounts.find((acc) => acc.id === id);
  };

  const addAccount = (accountData: Omit<Account, "id">) => {
    const newAccount: Account = {
      ...accountData,
      id: `acc_${Date.now()}`,
    };
    dispatch({ type: "ADD_ACCOUNT", payload: newAccount });
  };

  const updateAccount = (account: Account) => {
    dispatch({ type: "UPDATE_ACCOUNT", payload: account });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: "DELETE_ACCOUNT", payload: id });
  };

  return (
    <AccountsContext.Provider
      value={{
        state,
        dispatch,
        getFilteredAccounts,
        getAccountById,
        addAccount,
        updateAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountsContext);
  if (context === undefined) {
    throw new Error("useAccounts must be used within an AccountsProvider");
  }
  return context;
}
