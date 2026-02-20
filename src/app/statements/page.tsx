"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Table, Loader2, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { StatementDownloadCard } from "@/components/statements/StatementDownloadCard";
import { DatePickerField } from "@/components/statements/DatePickerField";
import { AccountSelect } from "@/components/statements/AccountSelect";
import { RecentDownloadsSection } from "@/components/statements/RecentDownloadsSection";

import { useAccounts } from "@/lib/context/AccountsContext";
import {
  balanceHistorySchema,
  transactionsStatementSchema,
  accountStatementSchema,
  statementTabSchema,
} from "@/lib/validation/statements";
import type { StatementDownload, BalanceHistoryFormData, TransactionsStatementFormData, AccountStatementFormData } from "@/types/statements";
import { format } from "date-fns";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function StatementsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state: accountsState } = useAccounts();
  
  const [recentDownloads, setRecentDownloads] = useState< StatementDownload[]>([]);
  const [downloading, setDownloading] = useState(false);
  
  const tabParam = searchParams.get("type") || "balance_history";
  const activeTab = statementTabSchema.parse(tabParam);

  const handleTabChange = (value: string) => {
    router.push(`/statements?type=${value}`);
  };

  const addDownload = (download: Omit<StatementDownload, "id" | "generatedAt">) => {
    const newDownload: StatementDownload = {
      ...download,
      id: Math.random().toString(36).substr(2, 9),
      generatedAt: new Date().toISOString(),
    };
    setRecentDownloads((prev) => [newDownload, ...prev]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Statements"
        subtitle="Download account statements and transaction history"
        icon={FileText}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="balance_history">Balance history statement</TabsTrigger>
          <TabsTrigger value="transactions">Transactions statement</TabsTrigger>
          <TabsTrigger value="account">Account statement</TabsTrigger>
        </TabsList>

        <TabsContent value="balance_history">
          <BalanceHistoryForm 
            onDownload={addDownload} 
            downloading={downloading}
            setDownloading={setDownloading}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsForm 
            onDownload={addDownload}
            downloading={downloading}
            setDownloading={setDownloading}
          />
        </TabsContent>

        <TabsContent value="account">
          <AccountStatementForm 
            onDownload={addDownload}
            downloading={downloading}
            setDownloading={setDownloading}
          />
        </TabsContent>
      </Tabs>

      <RecentDownloadsSection downloads={recentDownloads} />
    </div>
  );
}

export default function StatementsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <StatementsContent />
    </Suspense>
  );
}

// ============ BALANCE HISTORY FORM (Tab A) ============
interface FormProps {
  onDownload: (download: Omit<StatementDownload, "id" | "generatedAt">) => void;
  downloading: boolean;
  setDownloading: (v: boolean) => void;
}

function BalanceHistoryForm({ onDownload, downloading, setDownloading }: FormProps) {
  const { state: accountsState } = useAccounts();
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [accountId, setAccountId] = useState<string>("");

  const account = accountsState.accounts.find((a) => a.id === accountId);
  const today = new Date();
  const isValid = accountId && dateFrom && dateTo && dateFrom <= dateTo && dateTo <= today;

  const handleDownload = async () => {
    if (!isValid) return;
    
    setDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const dateRangeStr = `${formatDate(dateFrom!)} – ${formatDate(dateTo!)}`;
    toast.success(`Balance history downloaded (${dateRangeStr})`);
    
    onDownload({
      type: "balance_history",
      format,
      accountName: account!.name,
      accountId,
      dateRange: { from: dateFrom!, to: dateTo! },
      filename: `balance_history_${formatDateFilename(dateFrom!)}_${formatDateFilename(dateTo!)}.${format}`,
    });
    
    setDownloading(false);
  };

  return (
    <div className="max-w-lg">
      <StatementDownloadCard>
        <AccountSelect
          value={accountId}
          onChange={setAccountId}
          placeholder="Select an account"
        />

        <div className="grid grid-cols-2 gap-4">
          <DatePickerField
            label="From *"
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Select start date"
            maxDate={today}
          />
          <DatePickerField
            label="To *"
            value={dateTo}
            onChange={setDateTo}
            placeholder="Select end date"
            maxDate={today}
          />
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={cn(
                "flex-1 py-2 px-4 rounded-full font-medium transition-colors",
                format === "csv"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              )}
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={cn(
                "flex-1 py-2 px-4 rounded-full font-medium transition-colors",
                format === "pdf"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              )}
            >
              PDF
            </button>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!isValid || downloading}
          className="w-full py-2.5 rounded-lg"
        >
          {downloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing download...
            </>
          ) : (
            <>
              {format === "csv" ? <Table className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
              Download {format.toUpperCase()}
            </>
          )}
        </Button>
      </StatementDownloadCard>
    </div>
  );
}

// ============ TRANSACTIONS FORM (Tab B) ============
function TransactionsForm({ onDownload, downloading, setDownloading }: FormProps) {
  const { state: accountsState } = useAccounts();
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [accountId, setAccountId] = useState<string>("");
  const [allChecked, setAllChecked] = useState(true);
  const [transferChecked, setTransferChecked] = useState(true);
  const [fxChecked, setFxChecked] = useState(true);
  const [localChecked, setLocalChecked] = useState(true);

  const account = accountsState.accounts.find((a) => a.id === accountId);
  const today = new Date();
  const isValid = accountId && dateFrom && dateTo && dateFrom <= dateTo && dateTo <= today;

  const handleAllChange = (checked: boolean) => {
    setAllChecked(checked);
    setTransferChecked(checked);
    setFxChecked(checked);
    setLocalChecked(checked);
  };

  const handleDownload = async () => {
    if (!isValid) return;
    
    setDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const dateRangeStr = `${formatDate(dateFrom!)} – ${formatDate(dateTo!)}`;
    toast.success(`Transactions statement downloaded (${dateRangeStr})`);
    
    const types = [];
    if (allChecked) types.push("all");
    if (transferChecked) types.push("transfer");
    if (fxChecked) types.push("fx");
    if (localChecked) types.push("local");
    
    onDownload({
      type: "transactions",
      format,
      accountName: account!.name,
      accountId,
      dateRange: { from: dateFrom!, to: dateTo! },
      transactionTypes: types as any,
      filename: `transactions_statement_${formatDateFilename(dateFrom!)}_${formatDateFilename(dateTo!)}.${format}`,
    });
    
    setDownloading(false);
  };

  return (
    <div className="max-w-lg">
      <StatementDownloadCard>
        <AccountSelect
          value={accountId}
          onChange={setAccountId}
          placeholder="Select an account"
        />

        <div className="grid grid-cols-2 gap-4">
          <DatePickerField
            label="From *"
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Select start date"
            maxDate={today}
          />
          <DatePickerField
            label="To *"
            value={dateTo}
            onChange={setDateTo}
            placeholder="Select end date"
            maxDate={today}
          />
        </div>

        <div className="space-y-2">
          <Label>Transaction type</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => handleAllChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">All</span>
            </label>
            <div className="grid grid-cols-3 gap-2 ml-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={transferChecked}
                  onChange={(e) => {
                    setTransferChecked(e.target.checked);
                    setAllChecked(false);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Transfer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fxChecked}
                  onChange={(e) => {
                    setFxChecked(e.target.checked);
                    setAllChecked(false);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">FX</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localChecked}
                  onChange={(e) => {
                    setLocalChecked(e.target.checked);
                    setAllChecked(false);
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Local</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={cn(
                "flex-1 py-2 px-4 rounded-full font-medium transition-colors",
                format === "csv"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              )}
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={cn(
                "flex-1 py-2 px-4 rounded-full font-medium transition-colors",
                format === "pdf"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              )}
            >
              PDF
            </button>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!isValid || downloading}
          className="w-full py-2.5 rounded-lg"
        >
          {downloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing download...
            </>
          ) : (
            <>
              {format === "csv" ? <Table className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
              Download {format.toUpperCase()}
            </>
          )}
        </Button>
      </StatementDownloadCard>
    </div>
  );
}

// ============ ACCOUNT STATEMENT FORM (Tab C) ============
function AccountStatementForm({ onDownload, downloading, setDownloading }: FormProps) {
  const { state: accountsState } = useAccounts();
  const [accountId, setAccountId] = useState<string>("");
  const [month, setMonth] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();

  const account = accountsState.accounts.find((a) => a.id === accountId);
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
  
  const isValid = accountId && month !== undefined && year !== undefined;

  const handleDownload = async () => {
    if (!isValid) return;
    
    setDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const monthName = months[month!];
    toast.success(`Account statement downloaded for ${monthName} ${year}`);
    
    onDownload({
      type: "account",
      format: "pdf",
      accountName: account!.name,
      accountId,
      month: month!,
      year: year!,
      filename: `account_statement_${months[month!].toLowerCase()}_${year}.pdf`,
    });
    
    setDownloading(false);
  };

  return (
    <div className="max-w-lg">
      <StatementDownloadCard>
        <AccountSelect
          value={accountId}
          onChange={setAccountId}
          placeholder="Select an account"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Month <span className="text-destructive">*</span></Label>
            <select
              value={month ?? ""}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select month</option>
              {months.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Year <span className="text-destructive">*</span></Label>
            <select
              value={year ?? ""}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Account statements are generated at end of month. Statements for the current month may be incomplete.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          Format: <span className="font-medium text-foreground">PDF</span>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!isValid || downloading}
          className="w-full py-2.5 rounded-lg"
        >
          {downloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing download...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </StatementDownloadCard>
    </div>
  );
}

// ============ HELPERS ============
function formatDate(date: Date): string {
  return format(date, "MMM yyyy");
}

function formatDateFilename(date: Date): string {
  return format(date, "MMMyyyy");
}
