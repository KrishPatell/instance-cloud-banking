import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Help & Support</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Get help and access documentation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Help center coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
