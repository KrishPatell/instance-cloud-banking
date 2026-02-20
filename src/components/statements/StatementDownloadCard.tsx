import React from 'react';
import { cn } from '@/lib/utils';

interface StatementDownloadCardProps {
  children: React.ReactNode;
  className?: string;
}

export function StatementDownloadCard({ children, className }: StatementDownloadCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm p-6", className)}>
      <form className="space-y-5">
        {children}
      </form>
    </div>
  );
}
