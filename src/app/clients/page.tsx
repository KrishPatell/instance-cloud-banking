import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Manage client accounts and KYC verification.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Client management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
