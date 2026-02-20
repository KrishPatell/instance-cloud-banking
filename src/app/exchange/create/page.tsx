import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function CreateExchangePage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Create Currency Exchange"
        subtitle="Exchange between different currencies"
        icon={RefreshCw}
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Currency Exchange</h3>
            <p className="text-muted-foreground mb-4">
              Exchange funds between different currencies with real-time rates.
            </p>
            <Button>Coming Soon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
