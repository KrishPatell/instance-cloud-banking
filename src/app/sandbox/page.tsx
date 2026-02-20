"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { FlaskConical, CheckCircle2, Loader2 } from "lucide-react";
import { useAccounts } from "@/lib/context/AccountsContext";
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

// UUID generator
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function SandboxPage() {
  const { state: accountsState } = useAccounts();
  const { dispatch } = useTransactions();

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [externalReference, setExternalReference] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get open accounts only
  const openAccounts = useMemo(() => {
    return accountsState.accounts.filter((acc) => acc.status === "open");
  }, [accountsState.accounts]);

  const selectedAccount = useMemo(() => {
    return openAccounts.find((acc) => acc.id === selectedAccountId);
  }, [openAccounts, selectedAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccountId || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
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
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-2">
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
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {openAccounts.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No open accounts</div>
                ) : (
                  openAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{account.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Balance: {account.currency} {account.availableBalance.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
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
