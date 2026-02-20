"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, FileText, MoreHorizontal, Copy, ArrowUpRight, ArrowDownLeft, Download, Trash2 } from "lucide-react";
import { useTransactions } from "@/lib/context/TransactionsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";

interface TransactionPageProps {
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

export default function TransactionDetailPage({ params }: TransactionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getTransactionById, executeTransaction, failTransaction, returnTransaction, addDocument } = useTransactions();
  const [activeTab, setActiveTab] = useState("overview");
  
  const transaction = getTransactionById(id);

  if (!transaction) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Transaction Not Found</h1>
          <Button onClick={() => router.push("/transactions")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleRefresh = () => {
    toast.success("Transaction details refreshed");
  };

  const handleExecute = () => {
    executeTransaction(id);
    toast.success("Transaction executed (simulated)");
  };

  const handleFail = () => {
    failTransaction(id);
    toast.success("Transaction failed (simulated)");
  };

  const handleReturn = () => {
    returnTransaction(id);
    toast.success("Return payment initiated (simulated)");
  };

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
      second: '2-digit',
    });
  };

  const isInbound = transaction.direction === "inbound";

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/transactions")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Transaction {transaction.reference.slice(0, 12)}...</h1>
            <p className="text-muted-foreground">Transactions / Transaction</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <FileText className="w-4 h-4 mr-2" />
            Document
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExecute}>
                Simulate Execute
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFail}>
                Simulate Fail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReturn}>
                Simulate Return Payment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Transaction Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">UUID</label>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{transaction.id}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(transaction.id, "UUID")}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">External Reference</label>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{transaction.externalId || transaction.reference}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(transaction.reference, "Reference")}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Type</label>
                      <div className="mt-1">
                        <Badge className={typeColors[transaction.type] || "bg-gray-100"}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Direction</label>
                      <div className={`mt-1 flex items-center gap-1 ${isInbound ? 'text-green-600' : 'text-red-600'}`}>
                        {isInbound ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        <span className="font-medium">{isInbound ? 'Inbound' : 'Outbound'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Instructed Amount</label>
                  <div className={`text-3xl font-bold mt-1 ${isInbound ? 'text-green-600' : 'text-red-600'}`}>
                    {isInbound ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Remitter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">REMITTER</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-lg">{transaction.fromAccountName || "Unknown"}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Account ID: {transaction.fromAccountId}
                </p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleCopy(transaction.fromAccountId, "Account ID")}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </CardContent>
            </Card>

            {/* Beneficiary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">BENEFICIARY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-lg">{transaction.toAccountName || "Unknown"}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Account ID: {transaction.toAccountId}
                </p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleCopy(transaction.toAccountId, "Account ID")}>
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Transaction State */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">TRANSACTION STATE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={statusColors[transaction.status] || "bg-gray-100"}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Created</label>
                  <p className="font-medium mt-1">{formatDate(transaction.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Updated</label>
                  <p className="font-medium mt-1">{formatDate(transaction.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <Button size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {transaction.documents && transaction.documents.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Reference</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction.documents.map((doc) => (
                      <tr key={doc.id} className="border-b">
                        <td className="py-3 px-4">{doc.name || "Untitled"}</td>
                        <td className="py-3 px-4">{doc.type}</td>
                        <td className="py-3 px-4 font-mono text-sm">{doc.id.slice(0, 12)}...</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload documents using the button above
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
