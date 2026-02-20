import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          View and manage all transaction history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Transaction management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
