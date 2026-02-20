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
  ChevronRight,
  Home,
  User,
  Settings,
  LogOut,
  Ticket,
  Users,
  FileText,
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
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
  onSearchClick?: () => void;
}

// Page labels for breadcrumbs
const pageLabels: Record<string, string> = {
  "/": "Overview",
  "/accounts": "Accounts",
  "/payments": "Payments",
  "/transactions": "Transactions",
  "/cards": "Cards",
  "/clients": "Clients",
  "/settings": "Settings",
  "/help": "Help",
  "/sandbox": "Sandbox",
  "/statements": "Statements",
  "/batch-payments": "Batch Payments",
  "/payments/create": "Create Payment",
  "/accounts/create": "Create Account",
  "/transfers/create": "Create Transfer",
  "/exchange/create": "Create Exchange",
};

// Quick create items with keyboard shortcuts
const quickCreateItems = [
  { label: "New Payment", href: "/payments/create", icon: Plus, shortcut: "⌘N" },
  { label: "New Account", href: "/accounts/create", icon: Users, shortcut: "⌘⇧A" },
  { label: "New Client", href: "/clients", icon: User, shortcut: "⌘⇧C" },
  { label: "New Invoice", href: "/invoices/create", icon: FileText, shortcut: "⌘I" },
  { label: "Sandbox Test", href: "/sandbox", icon: RefreshCw, shortcut: "⌘S" },
];

// Notifications
const notifications = [
  { id: 1, title: "Payment Received", message: "ABC Corp sent £5,234.50", time: "2m ago", type: "success", unread: true },
  { id: 2, title: "Account Verified", message: "Your account has been verified", time: "1h ago", type: "info", unread: true },
  { id: 3, title: "Batch Complete", message: "15 payments processed", time: "3h ago", type: "success", unread: false },
  { id: 4, title: "Security Alert", message: "New login from Chrome", time: "5h ago", type: "warning", unread: false },
];

export function Topbar({ onMenuClick, sidebarCollapsed = false, onSearchClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get breadcrumbs for current path - simplified to just 2 items
  const getBreadcrumbs = () => {
    // Check exact match first
    if (pageLabels[pathname]) {
      return [
        { label: "Home", href: "/" },
        { label: pageLabels[pathname], href: pathname }
      ];
    }
    // Check for dynamic routes like /accounts/[id]
    for (const [path, label] of Object.entries(pageLabels)) {
      if (path.includes("[id]")) {
        const basePath = path.replace("[id]", "");
        if (pathname.startsWith(basePath) && pathname !== basePath) {
          return [
            { label: "Home", href: "/" },
            { label: pageLabels[basePath] || "Page", href: basePath }
          ];
        }
      }
    }
    // Default
    return [
      { label: "Home", href: "/" },
      { label: "Overview", href: "/" }
    ];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleCommandSelect = (href: string) => {
    router.push(href);
  };

  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <>
      <header
        className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 backdrop-blur-sm px-4 pl-16 lg:px-6"
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
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{currentPage.label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            February 2026 · All clouds
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Quick Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 h-9 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickCreateItems.map((item) => (
                <DropdownMenuItem 
                  key={item.href} 
                  onClick={() => handleCommandSelect(item.href)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    {item.shortcut}
                  </kbd>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div 
            className="relative hidden lg:block"
            onClick={onSearchClick}
          >
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors cursor-pointer min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Search...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          {/* Keyboard Shortcuts Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={onSearchClick}
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-2">
              <div className="text-xs space-y-1">
                <p><kbd className="font-mono">⌘K</kbd> Search</p>
                <p><kbd className="font-mono">⌘B</kbd> Toggle sidebar</p>
                <p><kbd className="font-mono">⌘N</kbd> Quick create</p>
                <p><kbd className="font-mono">⌘/</kbd> All shortcuts</p>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-lg"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="font-semibold">Notifications</span>
                <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <DropdownMenuItem 
                    key={notif.id} 
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer",
                      notif.unread && "bg-blue-50/50 dark:bg-blue-950/30"
                    )}
                  >
                    <div className="flex justify-between w-full">
                      <span className="font-medium text-sm">{notif.title}</span>
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{notif.message}</span>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-center text-sm text-muted-foreground">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-6 w-px bg-border mx-1" />

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2 rounded-lg hover:bg-muted">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-slate-900 text-white text-xs">KP</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">Krish</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Krish Patel</span>
                  <span className="text-xs font-normal text-muted-foreground">krish@stvble.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
