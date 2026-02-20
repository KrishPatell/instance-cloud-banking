"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Plus,
  ChevronDown,
  Keyboard,
  Compass,
  RefreshCw,
  Download,
  ChevronRight,
  Home,
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
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onSearchClick?: () => void;
}

// Breadcrumb mapping
const breadcrumbMap: Record<string, { label: string; href: string }[]> = {
  "/": [{ label: "Home", href: "/" }, { label: "Overview", href: "/" }],
  "/accounts": [{ label: "Home", href: "/" }, { label: "Accounts", href: "/accounts" }],
  "/accounts/[id]": [{ label: "Home", href: "/" }, { label: "Accounts", href: "/accounts" }, { label: "Account Details", href: "" }],
  "/payments": [{ label: "Home", href: "/" }, { label: "Payments", href: "/payments" }],
  "/payments/[id]": [{ label: "Home", href: "/" }, { label: "Payments", href: "/payments" }, { label: "Payment Details", href: "" }],
  "/transactions": [{ label: "Home", href: "/" }, { label: "Transactions", href: "/transactions" }],
  "/cards": [{ label: "Home", href: "/" }, { label: "Cards", href: "/cards" }],
  "/clients": [{ label: "Home", href: "/" }, { label: "Clients", href: "/clients" }],
  "/settings": [{ label: "Home", href: "/" }, { label: "Settings", href: "/settings" }],
  "/help": [{ label: "Home", href: "/" }, { label: "Help", href: "/help" }],
  "/sandbox": [{ label: "Home", href: "/" }, { label: "Sandbox", href: "/sandbox" }],
  "/batch-payments": [{ label: "Home", href: "/" }, { label: "Batch Payments", href: "/batch-payments" }],
};

export function Topbar({ onMenuClick, sidebarCollapsed = false, onSearchClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get breadcrumbs for current path
  const getBreadcrumbs = () => {
    // Check for exact match first
    if (breadcrumbMap[pathname]) {
      return breadcrumbMap[pathname];
    }
    // Check for partial matches
    for (const [path, crumbs] of Object.entries(breadcrumbMap)) {
      if (pathname.startsWith(path.replace("[id]", ""))) {
        return crumbs;
      }
    }
    return [{ label: "Home", href: "/" }, { label: "Page", href: pathname }];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  const handleCommandSelect = (href: string) => {
    router.push(href);
  };

  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <>
      <header
        className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6"
        style={{
          borderColor: "hsl(var(--border))",
          left: sidebarWidth,
          transition: "left 300ms ease-in-out",
        }}
      >
        {/* Left Section - Breadcrumbs */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            {breadcrumbs.slice(0, -1).map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
            {breadcrumbs.length > 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="font-semibold text-foreground">{currentPage.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            February 2026 · All clouds
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white border-0">
                <Plus className="h-4 w-4" />
                <span>Quick Create</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Outbound Payment</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create?tab=internal")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Internal Transfer</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/payments/create?tab=exchange")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Currency Exchange</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCommandSelect("/accounts/create")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCommandSelect("/sandbox")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Sandbox Simulation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Secondary Icons */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={onSearchClick}
          >
            <Keyboard className="h-4 w-4 text-gray-600" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <Compass className="h-4 w-4 text-gray-600" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Search Bar */}
          <div 
            className="relative w-64 cursor-pointer"
            onClick={onSearchClick}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              readOnly
              className="pl-9 pr-12 h-9 rounded-full border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-md border border-gray-200 hover:bg-gray-50"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Payment Received</span>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <span className="text-sm text-muted-foreground">ABC Corp sent you £5,234.50</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <div className="flex justify-between w-full">
                  <span className="font-medium">Account Verified</span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
                <span className="text-sm text-muted-foreground">Your account has been verified</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 border border-gray-200 rounded-md hover:bg-gray-50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-gray-600" />
            ) : (
              <Moon className="h-4 w-4 text-gray-600" />
            )}
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2 rounded-full border border-gray-200 hover:bg-gray-50">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-slate-900 text-white text-xs">KP</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Krish</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Krish Patel</span>
                  <span className="text-xs font-normal text-muted-foreground">krish@stvble.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
