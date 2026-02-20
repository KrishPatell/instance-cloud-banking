"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { FlaskConical, CheckCircle2, Loader2 } from "lucide-react";
import { useAccounts } from "@/lib/context/AccountsContext";
import { Account } from "@/types/payment";
import { useTransactions } from "@/lib/context/TransactionsContext";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// UUID generator
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function SandboxPage() {
  const { getFilteredAccounts } = useAccounts();
  const { dispatch } = useTransactions();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [externalReference, setExternalReference] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Get open accounts only
  const openAccounts = useMemo(() => {
    return getFilteredAccounts().filter((acc) => acc.status === "open");
  }, [getFilteredAccounts]);

  const selectedAccount = useMemo(() => {
    return openAccounts.find((acc) => acc.id === selectedAccountId);
  }, [openAccounts, selectedAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccountId || !amount) {
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    // Start processing
    setIsSubmitting(true);

    // Wait 1000ms
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create transaction matching the spec format
    const transaction = {
      id: generateId(),
      reference: externalReference || `TEST-${Date.now()}`,
      externalId: externalReference || generateId(),
      type: "outbound" as const,
      status: "settled" as const,
      amount: parsedAmount,
      currency: selectedAccount!.currency,
      direction: "inbound" as const,
      fromAccountId: "sandbox",
      toAccountId: selectedAccountId,
      fromAccountName: "Sandbox Simulation",
      toAccountName: selectedAccount!.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settledAt: new Date().toISOString(),
      documents: [],
    };

    // Add transaction via context (prepend)
    dispatch({ type: "ADD_TRANSACTION", payload: transaction });

    // Show dark toast with CheckCircle2
    toast("", {
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      description: "Simulated inbound payment submitted",
      className: "bg-zinc-900 text-white border-zinc-800 shadow-2xl rounded-xl",
      duration: 3000,
    });

    // Reset form
    setSelectedAccountId("");
    setAmount("");
    setExternalReference("");
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Simulated inbound payment"
        subtitle="Test inbound payment flows in your sandbox environment"
        icon={FlaskConical}
      />

      {/* Sandbox Banner */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 mb-6 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          You are in sandbox mode. Payments simulated here do not affect real balances.
        </p>
      </div>

      {/* Form Card */}
      <Card className="max-w-md bg-card border rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Beneficiary Account */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Beneficiary account *</label>
            <Select
              value={selectedAccountId}
              onValueChange={(value) => setSelectedAccountId(value)}
              open={searchOpen}
              onOpenChange={setSearchOpen}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <CommandLoop
                    accounts={openAccounts}
                    onSelect={(id) => {
                      setSelectedAccountId(id);
                      setSearchOpen(false);
                    }}
                    selectedId={selectedAccountId}
                  />
                </div>
              </SelectContent>
            </Select>
            {selectedAccount && (
              <p className="text-sm text-muted-foreground">
                Balance: {selectedAccount.currency} {selectedAccount.availableBalance.toLocaleString()}
              </p>
            )}
          </div>

          {/* Amount with Currency Prefix */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount *</label>
            <div className="flex">
              <div className="flex items-center justify-center px-3 bg-muted rounded-l-md border border-r-0 border-input min-w-[60px]">
                <span className="text-sm text-muted-foreground">
                  {selectedAccount?.currency || "USD"}
                </span>
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
          </div>

          {/* External Reference */}
          <div className="space-y-2">
            <label className="text-sm font-medium">External reference</label>
            <Input
              type="text"
              placeholder="e.g. test-payment-001"
              value={externalReference}
              onChange={(e) => setExternalReference(e.target.value.slice(0, 100))}
              maxLength={100}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!selectedAccountId || !amount || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// Command loop component for searchable dropdown
function CommandLoop({
  accounts,
  onSelect,
  selectedId,
}: {
  accounts: any[];
  onSelect: (id: string) => void;
  selectedId: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return accounts;
    const query = search.toLowerCase();
    return accounts.filter(
      (acc) =>
        acc.name.toLowerCase().includes(query) ||
        acc.externalId?.toLowerCase().includes(query)
    );
  }, [accounts, search]);

  return (
    <>
      <CommandInput
        placeholder="Search accounts..."
        value={search}
        onValueChange={setSearch}
        className="mb-2"
      />
      <CommandList className="max-h-[200px] overflow-auto">
        <CommandEmpty>No accounts found.</CommandEmpty>
        <CommandGroup>
          {filtered.map((account) => (
            <CommandItem
              key={account.id}
              value={account.id}
              onSelect={() => onSelect(account.id)}
              className={cn(
                "cursor-pointer",
                selectedId === account.id && "bg-accent"
              )}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{account.name}</span>
                <span className="text-xs text-muted-foreground">
                  Balance: {account.currency} {account.availableBalance.toLocaleString()}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  );
}
