import { cn } from "@/lib/utils";
import { ChevronLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: {
    label: string;
    href: string;
  };
  icon?: LucideIcon;
}

export function PageHeader({ title, subtitle, actions, breadcrumb, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      {breadcrumb && (
        <Link 
          href={breadcrumb.href}
          className="flex items-center gap-1 text-sm mb-2 hover:underline text-muted-foreground"
        >
          <ChevronLeft className="h-3 w-3" />
          {breadcrumb.label}
        </Link>
      )}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {Icon && (
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10"
            >
              <Icon 
                className="h-5 w-5 text-primary" 
              />
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm mt-0.5 text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
