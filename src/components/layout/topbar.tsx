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
  ChevronRight,
  Home,
  User,
  Settings,
  LogOut,
  Keyboard,
  HelpCircle,
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

export function Topbar({ onMenuClick, sidebarCollapsed = false, onSearchClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Get breadcrumbs for current path - simplified to just 2 items
  const getCurrentPage = () => {
    // Check exact match first
    if (pageLabels[pathname]) {
      return pageLabels[pathname];
    }
    // Check for dynamic routes like /accounts/[id]
    for (const [path, label] of Object.entries(pageLabels)) {
      if (path.includes("[id]")) {
        const basePath = path.replace("[id]", "");
        if (pathname.startsWith(basePath) && pathname !== basePath) {
          return pageLabels[basePath] || "Page";
        }
      }
    }
    return "Overview";
  };

  const currentPage = getCurrentPage();

  const sidebarWidth = sidebarCollapsed ? "64px" : "240px";

  return (
    <>
      <header
        className="fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 pl-16 lg:px-6"
        style={{
          borderColor: "#e5e7eb",
          left: sidebarWidth,
          transition: "left 200ms ease-in-out",
        }}
      >
        {/* Left Section - Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">{currentPage}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Quick Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="gap-2 h-9 px-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/payments/create")}>
                <Plus className="mr-2 h-4 w-4" />
                New Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/accounts/create")}>
                <Plus className="mr-2 h-4 w-4" />
                New Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/clients")}>
                <Plus className="mr-2 h-4 w-4" />
                New Client
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/sandbox")}>
                <Plus className="mr-2 h-4 w-4" />
                Sandbox Test
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div 
            className="hidden lg:flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer min-w-[180px]"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400 flex-1">Search...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Keyboard Shortcuts */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={onSearchClick}
              >
                <Keyboard className="h-4 w-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-2">
              <div className="text-xs space-y-1">
                <p><kbd className="font-mono">⌘K</kbd> Search</p>
                <p><kbd className="font-mono">⌘B</kbd> Toggle sidebar</p>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={() => router.push("/help")}
              >
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Help & Support
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
                <Bell className="h-4 w-4 text-gray-500" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="font-semibold">Notifications</span>
                <Badge variant="secondary" className="text-xs">3 new</Badge>
              </div>
              <div className="py-2">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-sm">Payment Received</span>
                    <span className="text-xs text-gray-400">2m ago</span>
                  </div>
                  <span className="text-xs text-gray-500">ABC Corp sent £5,234.50</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-sm">Account Verified</span>
                    <span className="text-xs text-gray-400">1h ago</span>
                  </div>
                  <span className="text-xs text-gray-500">Your account has been verified</span>
                </DropdownMenuItem>
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-center text-sm text-gray-500">
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
                  <Sun className="h-4 w-4 text-gray-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2 rounded-lg hover:bg-gray-100">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gray-900 text-white text-xs">KP</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-gray-700">Krish</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Krish Patel</span>
                  <span className="text-xs font-normal text-gray-500">krish@stvble.com</span>
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
