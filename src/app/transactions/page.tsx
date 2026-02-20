"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransactions, Transaction, PaymentStatus } from "@/lib/context/TransactionsContext";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const statusOptions: { value: PaymentStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "settled", label: "Settled" },
  { value: "rejected", label: "Rejected" },
  { value: "failed", label: "Failed" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "outbound", label: "Transfer" },
  { value: "exchange", label: "FX" },
  { value: "internal", label: "Internal" },
];

const directionOptions = [
  { value: "all", label: "All Directions" },
  { value: "outbound", label: "Outbound" },
  { value: "inbound", label: "Inbound" },
];

function getTypeIcon(type: string) {
  switch (type) {
    case "outbound":
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case "inbound":
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case "exchange":
      return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
    default:
      return <ArrowUpRight className="h-4 w-4" />;
  }
}

function getDirectionLabel(direction: string) {
  switch (direction) {
    case "outbound":
      return "Outbound";
    case "inbound":
      return "Inbound";
    default:
      return direction;
  }
}

function formatAmount(amount: number, currency: string, direction: string): string {
  const sign = direction === "outbound" ? "-" : "+";
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${currency} ${formatter.format(amount)}`;
}

export default function TransactionsPage() {
  const router = useRouter();
  const { state, dispatch, getFilteredTransactions, getTotalPages } = useTransactions();
  const [searchInput, setSearchInput] = useState("");
  
  const debouncedSearch = useDebounce(searchInput, 300);
  
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  useEffect(() => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: debouncedSearch });
  }, [debouncedSearch, dispatch]);

  const totalPages = getTotalPages();
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const paginatedTransactions = getFilteredTransactions().slice(
    startIndex,
    startIndex + state.itemsPerPage
  );

  const handleStatusChange = (value: string) => {
    dispatch({ type: "SET_STATUS_FILTER", payload: value as PaymentStatus | "all" });
  };

  const handleTypeChange = (value: string) => {
    dispatch({ type: "SET_TYPE_FILTER", payload: value as any });
  };

  const handleDirectionChange = (value: string) => {
    dispatch({ type: "SET_DIRECTION_FILTER", payload: value as any });
  };

  const handleDateRangeChange = (range: { start: Date | undefined; end: Date | undefined }) => {
    setDateRange(range);
    dispatch({
      type: "SET_DATE_RANGE",
      payload: { 
        start: range.start ? range.start.toISOString() : null, 
        end: range.end ? range.end.toISOString() : null 
      },
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
    dispatch({ type: "SET_STATUS_FILTER", payload: "all" });
    dispatch({ type: "SET_TYPE_FILTER", payload: "all" });
    dispatch({ type: "SET_DIRECTION_FILTER", payload: "all" });
    dispatch({ type: "SET_DATE_RANGE", payload: { start: null, end: null } });
    setDateRange({ start: undefined, end: undefined });
  };

  const hasActiveFilters =
    state.searchQuery ||
    state.statusFilter !== "all" ||
    state.typeFilter !== "all" ||
    state.directionFilter !== "all" ||
    dateRange.start ||
    dateRange.end;

  const activeFilterCount = [
    state.statusFilter !== "all",
    state.typeFilter !== "all",
    state.directionFilter !== "all",
    dateRange.start || dateRange.end,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Transactions</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>
          View and manage all transaction history.
        </p>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                {showFilters ? "Hide" : "Show"} Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference, description, or external ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid gap-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <Select
                    value={state.statusFilter}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Type</Label>
                  <Select
                    value={state.typeFilter}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction Filter */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Direction</Label>
                  <Select
                    value={state.directionFilter}
                    onValueChange={handleDirectionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {directionOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.start ? (
                          dateRange.end ? (
                            <>
                              {format(dateRange.start, "MMM d, yyyy")} -{" "}
                              {format(dateRange.end, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(dateRange.start, "MMM d, yyyy")
                          )
                        ) : (
                          "Select date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.start,
                          to: dateRange.end,
                        }}
                        onSelect={(range) =>
                          handleDateRangeChange({
                            start: range?.from,
                            end: range?.to,
                          })
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>From / To</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="cursor-pointer" onClick={() => router.push(`/transactions/${transaction.id}`)}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/transactions/${transaction.id}`}
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {transaction.reference}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.direction === "outbound"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {getDirectionLabel(transaction.direction)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-red-400" />
                          <span className="text-muted-foreground">From:</span>
                          {transaction.fromAccountName}
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowDownLeft className="h-3 w-3 text-green-400" />
                          <span className="text-muted-foreground">To:</span>
                          {transaction.toAccountName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      <span
                        className={
                          transaction.direction === "outbound"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      >
                        {formatAmount(
                          transaction.amount,
                          transaction.currency,
                          transaction.direction
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        variant={
                          transaction.status === "settled"
                            ? "settled"
                            : transaction.status === "pending"
                            ? "pending"
                            : transaction.status === "approved"
                            ? "approved"
                            : transaction.status === "rejected"
                            ? "rejected"
                            : "failed"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(transaction.createdAt, "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + state.itemsPerPage, getFilteredTransactions.length)} of{" "}
              {getFilteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_PAGE", payload: state.currentPage - 1 })
                }
                disabled={state.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === state.currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => dispatch({ type: "SET_PAGE", payload: page })}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_PAGE", payload: state.currentPage + 1 })
                }
                disabled={state.currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
