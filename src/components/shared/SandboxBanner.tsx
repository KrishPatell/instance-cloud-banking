import { FlaskConical } from "lucide-react";

interface SandboxBannerProps {
  className?: string;
}

export function SandboxBanner({ className }: SandboxBannerProps) {
  return (
    <div className={`rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-center gap-2 ${className || ""}`}>
      <FlaskConical className="h-5 w-5 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-800 dark:text-amber-200">
        You are in sandbox mode. Payments simulated here do not affect real balances.
      </p>
    </div>
  );
}
