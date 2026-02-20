"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAccounts } from "@/lib/context/AccountsContext";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Building2,
  Wallet,
  Save,
  X,
  Pencil,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import { Account } from "@/lib/mock-data/accounts";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  type?: "text" | "number";
  disabled?: boolean;
}

function EditableField({ label, value, onSave, type = "text", disabled = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (disabled) {
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">{label}</Label>
        <p className="text-sm font-medium">{value || "-"}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label className="text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
          <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8">
            <Save className="h-4 w-4 text-green-600" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8">
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium flex-1">{value || "-"}</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface AccountStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
}

function AccountStatementModal({ isOpen, onClose, accountName }: AccountStatementModalProps) {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Account Statement</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm mb-4 text-muted-foreground">
          Select the month and year to generate a statement for {accountName}.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!month || !year} onClick={() => alert(`Generating statement for ${month}/${year}`)}>
            Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccountById, updateAccount } = useAccounts();
  const [account, setAccount] = useState<Account | undefined>();
  const [showStatementModal, setShowStatementModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      const found = getAccountById(params.id as string);
      setAccount(found);
    }
  }, [params.id, getAccountById]);

  if (!account) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Account not found</p>
      </div>
    );
  }

  const handleUpdate = (field: keyof Account, value: string | number | boolean) => {
    const updated = { ...account, [field]: value };
    setAccount(updated);
    updateAccount(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/accounts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{account.name}</h1>
            <StatusBadge variant={account.status === "open" ? "open" : "pending"} />
          </div>
          <p className="text-muted-foreground">{account.externalId}</p>
        </div>
        <Button variant="outline" onClick={() => setShowStatementModal(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Statement
        </Button>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Available Balance</Label>
              <p className="text-3xl font-bold font-mono">
                {account.currency === "USD" ? "$" : account.currency === "AED" ? "AED " : ""}
                {account.availableBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Current Balance</Label>
              <p className="text-3xl font-bold font-mono">
                {account.currency === "USD" ? "$" : account.currency === "AED" ? "AED " : ""}
                {account.currentBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Account Details</TabsTrigger>
          <TabsTrigger value="banking">Banking Info</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <EditableField
                  label="Account Name"
                  value={account.name}
                  onSave={(value) => handleUpdate("name", value)}
                />
                <div className="space-y-2">
                  <Label className="text-muted-foreground">External ID</Label>
                  <p className="text-sm font-medium">{account.externalId}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Currency</Label>
                  <Select
                    value={account.currency}
                    onValueChange={(value) => handleUpdate("currency", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <Select
                    value={account.status}
                    onValueChange={(value) => handleUpdate("status", value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Account Owner</Label>
                  <p className="text-sm font-medium">{account.accountOwner}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Primary Account</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={account.isPrimary}
                      onChange={(e) => handleUpdate("isPrimary", e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Set as primary account</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <EditableField
                  label="Wire Account Number"
                  value={account.wireAccountNumber}
                  onSave={(value) => handleUpdate("wireAccountNumber", value)}
                  disabled={account.status !== "open"}
                />
                <EditableField
                  label="Routing Number"
                  value={account.routingNumber}
                  onSave={(value) => handleUpdate("routingNumber", value)}
                  disabled={account.status !== "open"}
                />
              </div>
              {account.status !== "open" && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Banking details can only be edited for open accounts.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Statement Modal */}
      <AccountStatementModal
        isOpen={showStatementModal}
        onClose={() => setShowStatementModal(false)}
        accountName={account.name}
      />
    </div>
  );
}
