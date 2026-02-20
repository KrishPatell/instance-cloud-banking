import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPayments } from "@/lib/mock-data/payments";
import { mockAccounts } from "@/lib/mock-data/accounts";
import { ArrowUpRight, ArrowLeft, ArrowDownLeft, Building2, Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

const typeLabels: Record<string, string> = {
  outbound: "Outbound Payment",
  internal: "Internal Transfer",
  exchange: "Currency Exchange",
};

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { id } = await params;
  const payment = mockPayments.find((p) => p.id === id);

  if (!payment) {
    notFound();
  }

  const fromAccount = mockAccounts.find((a) => a.id === payment.fromAccountId);
  const toAccount = payment.toAccountId
    ? mockAccounts.find((a) => a.id === payment.toAccountId)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Details"
        breadcrumb={{
          label: "Back to Payments",
          href: "/payments",
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Information</span>
              <StatusBadge variant={payment.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Payment ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{payment.id}</span>
                <CopyButton value={payment.id} />
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">External ID</span>
              <span className="font-mono text-sm">{payment.externalId || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm font-medium">{typeLabels[payment.type]}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-lg font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: payment.currency,
                }).format(payment.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="text-sm">{payment.reference || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {format(new Date(payment.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            {payment.updatedAt && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm">
                  {format(new Date(payment.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            )}
            {payment.settledAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Settled</span>
                <span className="text-sm">
                  {format(new Date(payment.settledAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Account */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">From Account</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{fromAccount?.name || "Unknown"}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {fromAccount?.accountOwner}
                </p>
                <p className="text-sm text-muted-foreground">
                  {fromAccount?.currency} • {fromAccount?.wireAccountNumber}
                </p>
              </div>
            </div>

            {/* To Account */}
            {toAccount ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">To Account</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{toAccount.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {toAccount.accountOwner}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">To</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{payment.toName || "External"}</span>
                </div>
              </div>
            )}

            {/* Description */}
            {payment.description && (
              <div>
                <span className="text-sm font-medium block mb-2">Description</span>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  {payment.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions - Only show for pending payments */}
      {payment.status === "pending" && (
        <div className="flex items-center gap-2">
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button variant="destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
