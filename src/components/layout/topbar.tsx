"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  Building2,
  ArrowUpRight,
  ArrowLeftRight,
  RefreshCw,
  FlaskConical,
  Wallet,
  ArrowUpDown,
  FileText,
  Users2,
  Settings,
  Plus,
  CreditCard,
  Send,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onSearchClick?: () => void;
}

const navigationItems = [
  { label: "Go to Accounts", href: "/accounts", icon: Wallet },
  { label: "Go to Transactions", href: "/transactions", icon: ArrowUpDown },
  { label: "Go to Customers", href: "/customers", icon: Users2 },
  { label: "Go to Statements", href: "/statements", icon: FileText },
  { label: "Go to Settings", href: "/settings", icon: Settings },
];

const actionItems = [
  { label: "Create outbound payment", href: "/payments/create", icon: ArrowUpRight },
  { label: "Create internal transfer", href: "/payments/create?tab=internal", icon: ArrowLeftRight },
  { label: "Create currency exchange", href: "/payments/create?tab=exchange", icon: RefreshCw },
  { label: "Simulate inbound payment", href: "/sandbox", icon: FlaskConical },
];

export function Topbar({ onMenuClick, sidebarCollapsed = false, onSearchClick }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [recentPages, setRecentPages] = React.useState<string[]>([]);

  // Load recent pages from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("recentPages");
    if (stored) {
      setRecentPages(JSON.parse(stored));
    }
  }, []);

  // Save to recent pages
  const addToRecent = (href: string) => {
    const updated = [href, ...recentPages.filter(p => p !== href)].slice(0, 3);
    setRecentPages(updated);
    localStorage.setItem("recentPages", JSON.stringify(updated));
  };

  const handleCommandSelect = (href: string) => {
    addToRecent(href);
    router.push(href);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <>
      <header
        className="fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b px-4 pl-16 lg:px-6"
        style={{
          backgroundColor: "hsl(var(--background))",
          borderColor: "hsl(var(--border))",
          left: sidebarWidth,
          transition: "left 300ms ease-in-out",
        }}
      >
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search with Cmd+K - triggers app-shell search */}
        <div 
          className="relative hidden flex-1 md:block md:max-w-xs lg:max-w-sm cursor-pointer"
          onClick={onSearchClick}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <Input
            placeholder="Search or type command..."
            readOnly
            className="cursor-pointer pl-9 pr-16"
            style={{
              backgroundColor: "hsl(var(--muted))",
              borderColor: "transparent",
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd
              className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
              style={{
                backgroundColor: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Create Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create")}>
                <Send className="mr-2 h-4 w-4" />
                <span>Outbound Payment</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create?tab=internal")}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                <span>Internal Transfer</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create?tab=exchange")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                <span>Currency Exchange</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/batch-payments/create")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Batch Payment</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCommandSelect("/accounts/create")}>
                <Building2 className="mr-2 h-4 w-4" />
                <span>New Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/sandbox")}>
                <FlaskConical className="mr-2 h-4 w-4" />
                <span>Sandbox Simulation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          {/* Notification Bell with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full" 
                  style={{ backgroundColor: "hsl(var(--destructive))" }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Payment Received</span>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <span className="text-sm text-muted-foreground">ABC Corp sent you £5,234.50</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Account Verified</span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
                <span className="text-sm text-muted-foreground">Your account has been verified</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Batch Complete</span>
                  <span className="text-xs text-muted-foreground">3h ago</span>
                </div>
                <span className="text-sm text-muted-foreground">15 payments processed successfully</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help & Documentation</TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div 
            className="h-5 w-px mx-1" 
            style={{ backgroundColor: "hsl(var(--border))" }}
          />

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback
                    style={{ 
                      backgroundColor: "hsl(var(--primary))", 
                      color: "hsl(var(--primary-foreground))" 
                    }}
                  >
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>John Doe</span>
                  <span className="text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>
                    john@instance.cloud
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
