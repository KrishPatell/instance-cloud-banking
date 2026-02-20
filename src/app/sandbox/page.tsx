"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { FlaskConical, CheckCircle2, Loader2, Plus, Trash2, History, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Building2 } from "lucide-react";
import { useAccounts } from "@/lib/context/AccountsContext";
import { useTransactions } from "@/lib/context/TransactionsContext";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// UUID generator
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate reference
function generateReference(prefix: string = "TEST"): string {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${dateStr}-${random}`;
}

export default function SandboxPage() {
  const { state: accountsState } = useAccounts();
  const { dispatch: transactionsDispatch, state: transactionsState } = useTransactions();

  const [activeTab, setActiveTab] = useState("simulate");

  // Get open accounts only
  const openAccounts = useMemo(() => {
    return accountsState.accounts.filter((acc) => acc.status === "open");
  }, [accountsState.accounts]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Sandbox Environment"
        subtitle="Test and simulate payment flows, webhooks, and account changes"
        icon={FlaskConical}
      />

      {/* Sandbox Banner */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
        <FlaskConical className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-200">Sandbox Mode Active</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            All actions in this environment are simulated and will not affect real accounts or balances.
            Use this for testing, demos, and development.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="simulate" className="gap-2">
            <Plus className="h-4 w-4" />
            Simulate
          </TabsTrigger>
          <TabsTrigger value="bulk" className="gap-2">
            <History className="h-4 w-4" />
            Bulk Sim
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <Building2 className="h-4 w-4" />
            Account Tools
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulate">
          <SimulatePaymentTab accounts={openAccounts} onSimulate={(txn) => {
            transactionsDispatch({ type: "ADD_TRANSACTION", payload: txn });
          }} />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkSimulateTab accounts={openAccounts} onSimulate={(txns) => {
            txns.forEach(txn => {
              transactionsDispatch({ type: "ADD_TRANSACTION", payload: txn });
            });
          }} />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountToolsTab accounts={accountsState.accounts} />
        </TabsContent>

        <TabsContent value="history">
          <ActivityTab transactions={transactionsState.transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============ SIMULATE PAYMENT TAB ============
function SimulatePaymentTab({ accounts, onSimulate }: { accounts: any[], onSimulate: (txn: any) => void }) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [externalReference, setExternalReference] = useState<string>("");
  const [direction, setDirection] = useState<"inbound" | "outbound">("inbound");
  const [paymentType, setPaymentType] = useState<"outbound" | "internal" | "exchange">("outbound");
  const [status, setStatus] = useState<"settled" | "pending" | "failed">("settled");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !amount) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const transaction = {
      id: generateId(),
      reference: externalReference || generateReference(),
      externalId: externalReference || generateId(),
      type: paymentType,
      status,
      amount: parsedAmount,
      currency: selectedAccount!.currency,
      direction,
      fromAccountId: direction === "outbound" ? selectedAccountId : "sandbox",
      toAccountId: direction === "inbound" ? selectedAccountId : "sandbox",
      fromAccountName: direction === "outbound" ? selectedAccount!.name : "Sandbox Simulation",
      toAccountName: direction === "inbound" ? selectedAccount!.name : "Sandbox Simulation",
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settledAt: status === "settled" ? new Date().toISOString() : undefined,
      documents: [],
    };

    onSimulate(transaction);

    toast("", {
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      description: `Simulated ${status} ${direction} payment of ${selectedAccount!.currency} ${parsedAmount.toLocaleString()}`,
      className: "bg-zinc-900 text-white border-zinc-800",
    });

    setSelectedAccountId("");
    setAmount("");
    setExternalReference("");
    setDescription("");
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Simulator</CardTitle>
          <CardDescription>Create a simulated payment transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Direction */}
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="direction"
                  checked={direction === "inbound"}
                  onCheckedChange={(checked) => setDirection(checked ? "inbound" : "outbound")}
                />
                <Label htmlFor="direction">
                  {direction === "inbound" ? "Inbound (Receive)" : "Outbound (Send)"}
                </Label>
              </div>
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label>Account *</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {account.currency} {account.availableBalance.toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount *</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 border-input">
                  <span className="text-sm text-muted-foreground">{selectedAccount?.currency || "USD"}</span>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outbound">Outbound</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="exchange">Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="settled">Settled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <Label>External Reference</Label>
              <Input
                placeholder="e.g. TEST-20260220-0001"
                value={externalReference}
                onChange={(e) => setExternalReference(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Payment description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!selectedAccountId || !amount || isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Simulate Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              {direction === "inbound" ? (
                <ArrowDownLeft className="h-8 w-8 text-green-600" />
              ) : (
                <ArrowUpRight className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p className="text-2xl font-bold">
                  {direction === "inbound" ? "+" : "-"}
                  {selectedAccount?.currency || "USD"} {amount || "0"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {direction === "inbound" ? "Received" : "Sent"} • {status}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From:</span>
                <span>{direction === "outbound" ? selectedAccount?.name || "Select account" : "Sandbox Simulation"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">To:</span>
                <span>{direction === "inbound" ? selectedAccount?.name || "Select account" : "Sandbox Simulation"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline">{paymentType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-mono text-xs">{externalReference || generateReference()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ BULK SIMULATE TAB ============
function BulkSimulateTab({ accounts, onSimulate }: { accounts: any[], onSimulate: (txns: any[]) => void }) {
  const [count, setCount] = useState<string>("5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: number; failed: number} | null>(null);

  const handleBulkSimulate = async () => {
    const numPayments = parseInt(count) || 5;
    if (numPayments < 1 || numPayments > 100) {
      toast.error("Please enter a number between 1 and 100");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const txns = [];
    for (let i = 0; i < numPayments; i++) {
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const isInbound = Math.random() > 0.5;
      const amount = Math.random() * 10000;

      txns.push({
        id: generateId(),
        reference: generateReference("BULK"),
        externalId: generateId(),
        type: ["outbound", "internal", "exchange"][Math.floor(Math.random() * 3)] as any,
        status: ["settled", "pending", "failed"][Math.floor(Math.random() * 3)] as any,
        amount,
        currency: account.currency,
        direction: isInbound ? "inbound" : "outbound",
        fromAccountId: isInbound ? "sandbox" : account.id,
        toAccountId: isInbound ? account.id : "sandbox",
        fromAccountName: isInbound ? "Sandbox Bulk" : account.name,
        toAccountName: isInbound ? account.name : "Sandbox Bulk",
        description: `Bulk test payment ${i + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
      });
    }

    onSimulate(txns);
    setResult({ success: numPayments, failed: 0 });
    setIsSubmitting(false);

    toast.success(`Simulated ${numPayments} bulk payments`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Payment Simulation</CardTitle>
        <CardDescription>Generate multiple test payments at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-6 border-2 border-dashed rounded-lg">
          <div className="space-y-2 flex-1">
            <Label>Number of Payments</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="5"
            />
            <p className="text-xs text-muted-foreground">Enter a number between 1 and 100</p>
          </div>
          <Button onClick={handleBulkSimulate} disabled={isSubmitting} className="mt-6">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate"}
          </Button>
        </div>

        {result && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Successfully generated {result.success} payments</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{accounts.length}</p>
            <p className="text-sm text-muted-foreground">Available Accounts</p>
          </div>
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">{parseInt(count) || 0}</p>
            <p className="text-sm text-muted-foreground">Payments to Create</p>
          </div>
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-2xl font-bold">100</p>
            <p className="text-sm text-muted-foreground">Max Allowed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ ACCOUNT TOOLS TAB ============
function AccountToolsTab({ accounts }: { accounts: any[] }) {
  const { dispatch } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [action, setAction] = useState<"fund" | "deduct" | "reset">("fund");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  const handleAction = async () => {
    if (!selectedAccountId || !amount) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const parsedAmount = parseFloat(amount);

    // Note: This would need to dispatch to AccountsContext to actually update
    // For now, just show toast
    toast.success(`${action === "fund" ? "Added" : action === "deduct" ? "Deducted" : "Reset"} ${parsedAmount} to account (simulated)`);

    setAmount("");
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Balance Tools</CardTitle>
          <CardDescription>Modify account balances for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Account</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-muted-foreground ml-2">{account.currency} {account.availableBalance.toLocaleString()}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={action} onValueChange={(v: any) => setAction(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fund">Add Funds</SelectItem>
                <SelectItem value="deduct">Deduct Funds</SelectItem>
                <SelectItem value="reset">Reset Balance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button onClick={handleAction} disabled={!selectedAccountId || !amount || isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accounts.slice(0, 5).map((account) => (
              <div key={account.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">{account.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{account.currency} {account.availableBalance.toLocaleString()}</p>
                  <Badge variant={account.status === "open" ? "default" : "secondary"}>{account.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ ACTIVITY TAB ============
function ActivityTab({ transactions }: { transactions: any[] }) {
  const sandboxTxns = transactions
    .filter((t) => t.fromAccountName === "Sandbox Simulation" || t.fromAccountName === "Sandbox Bulk" || t.toAccountName === "Sandbox Simulation" || t.toAccountName === "Sandbox Bulk" || t.fromAccountId === "sandbox")
    .slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sandbox Activity</CardTitle>
        <CardDescription>Recent simulated transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {sandboxTxns.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No sandbox activity yet</p>
            <p className="text-sm">Simulate payments to see them here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sandboxTxns.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {txn.direction === "inbound" ? (
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{txn.fromAccountName} → {txn.toAccountName}</p>
                    <p className="text-xs text-muted-foreground">{txn.reference} • {new Date(txn.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${txn.direction === "inbound" ? "text-green-600" : "text-red-600"}`}>
                    {txn.direction === "inbound" ? "+" : "-"}{txn.currency} {txn.amount.toLocaleString()}
                  </p>
                  <Badge variant="outline">{txn.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
