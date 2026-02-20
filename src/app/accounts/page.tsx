import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Manage your business accounts and balances.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Account management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
