import { cn } from "@/lib/utils";
import { LucideIcon, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon: Icon = FileQuestion, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16", className)}>
      <div 
        className="h-12 w-12 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.1)" }}
      >
        <Icon 
          className="h-6 w-6" 
          style={{ color: "hsl(var(--muted-foreground) / 0.3)" }} 
        />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p 
          className="text-sm mt-1 text-center" 
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button 
          className="mt-4" 
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
