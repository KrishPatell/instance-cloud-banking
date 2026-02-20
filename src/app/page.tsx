import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  CreditCard,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p style={{ color: "var(--muted-foreground)" }}>
          Welcome back! Here's what's happening with your accounts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,245,890</div>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--success)" }}>
              <ArrowUpRight className="h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Users className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--success)" }}>
              <ArrowUpRight className="h-3 w-3" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cards Issued</CardTitle>
            <CreditCard className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--destructive)" }}>
              <ArrowDownRight className="h-3 w-3" />
              -2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <Activity className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,328,500</div>
            <p className="text-xs flex items-center gap-1" style={{ color: "var(--success)" }}>
              <ArrowUpRight className="h-3 w-3" />
              +24.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Chart Placeholder */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="h-[300px] w-full rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  <p style={{ color: "var(--muted-foreground)" }}>
                    Chart component will be added here
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--muted)" }}
                        >
                          <DollarSign className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Payment Received</p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            Acme Corporation
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: "var(--success)" }}>
                          +$12,500
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          2m ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: "var(--muted-foreground)" }}>
                Analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: "var(--muted-foreground)" }}>
                Reports dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
