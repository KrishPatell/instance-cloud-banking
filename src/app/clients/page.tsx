import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Clients</h1>
        <p className="text-sm text-muted-foreground">
          Manage client accounts and KYC verification.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Client management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
