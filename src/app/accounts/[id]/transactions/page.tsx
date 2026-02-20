"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/lib/context/AccountsContext";
import { useTransactions } from "@/lib/context/TransactionsContext";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface AccountTransactionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusColors: Record<string, string> = {
  settled: "bg-green-100 text-green-900",
  pending: "bg-amber-100 text-amber-900",
  failed: "bg-red-100 text-red-900",
  rejected: "bg-gray-100 text-gray-900",
  approved: "bg-blue-100 text-blue-900",
};

const typeColors: Record<string, string> = {
  outbound: "bg-blue-100 text-blue-900",
  internal: "bg-orange-100 text-orange-900",
  exchange: "bg-green-100 text-green-900",
};

export default function AccountTransactionsPage({ params }: AccountTransactionsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getAccountById } = useAccounts();
  const { getTransactionsByAccountId, state, dispatch } = useTransactions();
  
  const account = getAccountById(id);
  const allTransactions = getTransactionsByAccountId(id);
  
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: searchInput });
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_STATUS_FILTER", payload: statusFilter as any });
  }, [statusFilter, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_TYPE_FILTER", payload: typeFilter as any });
  }, [typeFilter, dispatch]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!account) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
          <Button onClick={() => router.push("/accounts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Transactions"
        subtitle={`Transactions for ${account.name}`}
        breadcrumb={{ label: "Accounts", href: "/accounts" }}
      />

      {/* Filters Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Find by reference..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="exchange">Exchange</SelectItem>
              </SelectContent>
            </Select>
            {(searchInput || statusFilter !== "all" || typeFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchInput("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {allTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTransactions.map((txn) => {
                  const isInbound = txn.direction === "inbound";
                  const counterparty = isInbound ? txn.fromAccountName : txn.toAccountName;
                  
                  return (
                    <TableRow
                      key={txn.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/transactions/${txn.id}`)}
                    >
                      <TableCell className="font-medium">
                        {formatDate(txn.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[txn.type] || "bg-gray-100"}>
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{counterparty || "Unknown"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {txn.reference.slice(0, 20)}...
                      </TableCell>
                      <TableCell>
                        <span className={isInbound ? "text-green-600" : "text-red-600"}>
                          {isInbound ? "+" : "-"}
                          {formatCurrency(txn.amount, txn.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[txn.status] || "bg-gray-100"}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
