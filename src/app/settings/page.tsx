import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Configure your dashboard preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "var(--muted-foreground)" }}>
            Settings panel coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
