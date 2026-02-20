"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentForm } from "@/components/payments/payment-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowLeftRight, RefreshCw } from "lucide-react";

function CreatePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabParam = searchParams.get("tab") || "outbound";
  const [activeTab, setActiveTab] = useState(tabParam);
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["outbound", "internal", "exchange"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSuccess = () => {
    router.push("/payments");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="outbound" className="gap-2">
          <ArrowUpRight className="h-4 w-4" />
          Outbound
        </TabsTrigger>
        <TabsTrigger value="internal" className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Transfer
        </TabsTrigger>
        <TabsTrigger value="exchange" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Exchange
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outbound">
        <Card>
          <CardHeader>
            <CardTitle>Outbound Payment</CardTitle>
            <CardDescription>
              Send money to an external account or beneficiary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm onSuccess={handleSuccess} defaultType="outbound" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="internal">
        <Card>
          <CardHeader>
            <CardTitle>Internal Transfer</CardTitle>
            <CardDescription>
              Transfer funds between your internal accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm onSuccess={handleSuccess} defaultType="internal" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="exchange">
        <Card>
          <CardHeader>
            <CardTitle>Currency Exchange</CardTitle>
            <CardDescription>
              Exchange funds between different currencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm onSuccess={handleSuccess} defaultType="exchange" />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function CreatePaymentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Payment"
        subtitle="Create a new payment or transfer"
        breadcrumb={{
          label: "Back to Payments",
          href: "/payments",
        }}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <CreatePaymentContent />
      </Suspense>
    </div>
  );
}
