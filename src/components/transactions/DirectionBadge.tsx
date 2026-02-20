import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DirectionBadgeProps {
  direction: "inbound" | "outbound";
  variant?: "badge" | "text";
}

export function DirectionBadge({ direction, variant = "badge" }: DirectionBadgeProps) {
  const isInbound = direction === "inbound";
  
  if (variant === "text") {
    return (
      <span className={`flex items-center gap-1 ${isInbound ? "text-green-600" : "text-red-600"}`}>
        {isInbound ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
        <span className="font-medium">{isInbound ? "Inbound" : "Outbound"}</span>
      </span>
    );
  }

  return (
    <Badge className={`${isInbound ? "bg-green-100 text-green-900 border-green-200" : "bg-red-100 text-red-900 border-red-200"} border`}>
      {isInbound ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownLeft className="w-3 h-3 mr-1" />}
      {isInbound ? "Inbound" : "Outbound"}
    </Badge>
  );
}
