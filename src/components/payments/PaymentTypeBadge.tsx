import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowLeftRight, RefreshCw, FlaskConical } from "lucide-react";

interface PaymentTypeBadgeProps {
  type: "outbound" | "internal" | "exchange" | "sandbox";
  variant?: "badge" | "text";
}

const typeConfig = {
  outbound: {
    label: "Outbound",
    className: "bg-blue-100 text-blue-900 border-blue-200",
    icon: ArrowUpRight,
  },
  internal: {
    label: "Internal",
    className: "bg-orange-100 text-orange-900 border-orange-200",
    icon: ArrowLeftRight,
  },
  exchange: {
    label: "Exchange",
    className: "bg-green-100 text-green-900 border-green-200",
    icon: RefreshCw,
  },
  sandbox: {
    label: "Sandbox",
    className: "bg-purple-100 text-purple-900 border-purple-200",
    icon: FlaskConical,
  },
};

export function PaymentTypeBadge({ type, variant = "badge" }: PaymentTypeBadgeProps) {
  const config = typeConfig[type] || typeConfig.outbound;
  const Icon = config.icon;

  if (variant === "text") {
    return (
      <span className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  return (
    <Badge className={`${config.className} border`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
