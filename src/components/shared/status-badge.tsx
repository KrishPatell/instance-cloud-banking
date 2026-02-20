import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

type StatusVariant = "open" | "pending" | "approved" | "settled" | "rejected" | "failed" | "cancelled";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  open: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    dot: "bg-green-500",
  },
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    dot: "bg-amber-500",
  },
  approved: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  rejected: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  settled: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  failed: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  cancelled: {
    bg: "bg-gray-500/10",
    text: "text-gray-600",
    dot: "bg-gray-500",
  },
};

export function StatusBadge({ variant, label, dot = true, className }: StatusBadgeProps) {
  const styles = variantStyles[variant];
  
  // Handle dark mode
  const getDarkStyles = () => {
    switch (variant) {
      case "open":
        return { bg: "bg-green-500/20", text: "text-green-400", dot: "bg-green-400" };
      case "pending":
        return { bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" };
      case "approved":
        return { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" };
      case "rejected":
        return { bg: "bg-red-500/20", text: "text-red-400", dot: "bg-red-400" };
      case "settled":
        return { bg: "bg-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" };
      case "failed":
        return { bg: "bg-red-500/20", text: "text-red-400", dot: "bg-red-400" };
      case "cancelled":
        return { bg: "bg-gray-500/20", text: "text-gray-400", dot: "bg-gray-400" };
    }
  };
  
  const darkStyles = getDarkStyles();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles.bg,
        styles.text,
        "dark:" + darkStyles.bg,
        "dark:" + darkStyles.text,
        className
      )}
    >
      {dot && (
        <span 
          className={cn("w-1.5 h-1.5 rounded-full", styles.dot, "dark:" + darkStyles.dot)} 
        />
      )}
      {label || variant.charAt(0).toUpperCase() + variant.slice(1)}
    </span>
  );
}
