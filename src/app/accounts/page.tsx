"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAccounts } from "@/lib/context/AccountsContext";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building2, Wallet, ArrowRightLeft } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function AccountsPage() {
  const { state, dispatch, getFilteredAccounts } = useAccounts();
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAccounts = useMemo(() => {
    return getFilteredAccounts();
  }, [getFilteredAccounts, state.searchQuery, state.statusFilter]);

  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAccounts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAccounts, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: "all" | "open" | "pending") => {
    dispatch({ type: "SET_STATUS_FILTER", payload: filter });
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value });
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "name",
      header: "Account Name",
      cell: (row: typeof filteredAccounts[0]) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">
              {row.externalId}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: typeof filteredAccounts[0]) => (
        <StatusBadge variant={row.status === "open" ? "open" : "pending"} />
      ),
    },
    {
      key: "currency",
      header: "Currency",
    },
    {
      key: "availableBalance",
      header: "Available Balance",
      cell: (row: typeof filteredAccounts[0]) => (
        <div className="font-mono">
          {row.currency === "USD" ? "$" : row.currency === "AED" ? "AED " : ""}
          {row.availableBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      key: "currentBalance",
      header: "Current Balance",
      cell: (row: typeof filteredAccounts[0]) => (
        <div className="font-mono">
          {row.currency === "USD" ? "$" : row.currency === "AED" ? "AED " : ""}
          {row.currentBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      key: "isPrimary",
      header: "Primary",
      cell: (row: typeof filteredAccounts[0]) =>
        row.isPrimary ? (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Primary
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[50px]",
      cell: (row: typeof filteredAccounts[0]) => (
        <Link href={`/accounts/${row.id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  // Calculate totals
  const totalBalance = filteredAccounts.reduce((sum, acc) => sum + acc.availableBalance, 0);
  const openAccounts = state.accounts.filter((a) => a.status === "open").length;
  const pendingAccounts = state.accounts.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your business accounts and balances.
            </p>
          </div>
          <Link href="/accounts/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {state.accounts.length} accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Open Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openAccounts}</div>
            <p className="text-xs text-muted-foreground">
              Active accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">Pending Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAccounts}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting activation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={state.statusFilter}
          onValueChange={(v) => handleFilterChange(v as "all" | "open" | "pending")}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={state.searchQuery}
              onChange={handleSearch}
              className="pl-9 w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={paginatedAccounts}
            loading={state.loading}
            emptyState={{
              title: "No accounts found",
              description: state.searchQuery
                ? "Try adjusting your search query"
                : "Get started by creating a new account",
            }}
            onRowClick={(row) => (window.location.href = `/accounts/${row.id}`)}
            pagination={
              totalPages > 1
                ? {
                    page: currentPage,
                    totalPages,
                    onPageChange: setCurrentPage,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
