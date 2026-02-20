"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PaymentForm } from "@/components/payments/payment-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowLeftRight, RefreshCw } from "lucide-react";

export default function CreatePaymentPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to payments list after successful creation
    router.push("/payments");
  };

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

      <Tabs defaultValue="outbound" className="space-y-6">
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
              <PaymentForm onSuccess={handleSuccess} />
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
              <PaymentForm onSuccess={handleSuccess} />
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
              <PaymentForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
