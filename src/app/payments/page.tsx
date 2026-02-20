"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { mockPayments } from "@/lib/mock-data/payments";
import { Payment, PaymentStatus } from "@/types/payment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, Search, Plus } from "lucide-react";
import { format } from "date-fns";

const statusOptions: PaymentStatus[] = ["pending", "approved", "rejected", "settled", "failed"];

const typeLabels: Record<string, string> = {
  outbound: "Outbound",
  internal: "Internal Transfer",
  exchange: "Currency Exchange",
};

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.toName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: "id",
      header: "Payment ID",
      cell: (row: Payment) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{row.id}</span>
          <CopyButton value={row.id} />
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (row: Payment) => (
        <span className="text-sm">{typeLabels[row.type] || row.type}</span>
      ),
    },
    {
      key: "toName",
      header: "To",
      cell: (row: Payment) => (
        <span className="text-sm">{row.toName || "—"}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row: Payment) => (
        <span className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: row.currency,
          }).format(row.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Payment) => <StatusBadge variant={row.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      cell: (row: Payment) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row: Payment) => (
        <Link href={`/payments/${row.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="View and manage all payment transactions"
        actions={
          <Link href="/payments/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Payment
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns as any}
        data={filteredPayments as any}
        emptyState={{
          title: "No payments found",
          description: "Try adjusting your filters or create a new payment",
        }}
      />
    </div>
  );
}
