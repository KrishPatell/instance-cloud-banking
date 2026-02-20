import { ArrowLeft, RefreshCw, FileText, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface PaymentDetailHeaderProps {
  paymentId: string;
  reference: string;
  status: string;
  onRefresh?: () => void;
  onAddDocument?: () => void;
  onSimulateExecute?: () => void;
  onSimulateFail?: () => void;
  onSimulateReturn?: () => void;
}

const statusColors: Record<string, string> = {
  settled: "bg-green-100 text-green-900 border-green-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  failed: "bg-red-100 text-red-900 border-red-200",
  rejected: "bg-gray-100 text-gray-900 border-gray-200",
  approved: "bg-blue-100 text-blue-900 border-blue-200",
};

export function PaymentDetailHeader({
  paymentId,
  reference,
  status,
  onRefresh,
  onAddDocument,
  onSimulateExecute,
  onSimulateFail,
  onSimulateReturn,
}: PaymentDetailHeaderProps) {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payment {reference.slice(0, 12)}...</h1>
          <p className="text-muted-foreground">Payments / Payment</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={onAddDocument}>
          <FileText className="w-4 h-4 mr-2" />
          Document
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onSimulateExecute}>
              Simulate Execute
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSimulateFail}>
              Simulate Fail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSimulateReturn}>
              Simulate Return Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export { statusColors };
