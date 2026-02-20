import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Cards</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Manage corporate cards and spending limits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Corporate Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Card management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
