import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Plus } from "lucide-react";
import Link from "next/link";

export default function BatchPaymentsPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Batch Payments"
        subtitle="View and manage batch payment processing"
        icon={Layers}
        actions={
          <Link href="/batch-payments/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </Link>
        }
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Batch Payments</h3>
            <p className="text-muted-foreground mb-4">
              Create a batch payment to process multiple transactions at once.
            </p>
            <Link href="/batch-payments/create">
              <Button>Create Batch Payment</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
