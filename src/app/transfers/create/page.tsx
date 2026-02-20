import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

export default function CreateTransferPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Create Internal Transfer"
        subtitle="Transfer funds between your accounts"
        icon={ArrowLeftRight}
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ArrowLeftRight className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Internal Transfer</h3>
            <p className="text-muted-foreground mb-4">
              This feature allows you to transfer funds between your internal accounts.
            </p>
            <Button>Coming Soon</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
