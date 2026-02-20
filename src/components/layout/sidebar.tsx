"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Building2,
  Plus,
  ArrowUpRight,
  ArrowLeftRight,
  RefreshCw,
  Files,
  FlaskConical,
  Wallet,
  ArrowUpDown,
  Layers,
  FileText,
  Users2,
  Grid3X3,
  LayoutDashboard,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useTheme } from "next-themes";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Create a payment",
    icon: Plus,
    children: [
      {
        title: "Create outbound payment",
        href: "/payments/create",
        icon: ArrowUpRight,
      },
      {
        title: "Create internal transfer",
        href: "/payments/create?tab=internal&type=internal",
        icon: ArrowLeftRight,
      },
      {
        title: "Create currency exchange",
        href: "/payments/create?tab=exchange&type=exchange",
        icon: RefreshCw,
      },
      {
        title: "Create batch payment",
        href: "/batch-payments/create",
        icon: Files,
      },
      {
        title: "Simulate inbound payment",
        href: "/sandbox",
        icon: FlaskConical,
      },
    ],
  },
  {
    title: "Accounts",
    href: "/accounts",
    icon: Wallet,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: ArrowUpDown,
  },
  {
    title: "Cards",
    href: "/cards",
    icon: CreditCard,
  },
  {
    title: "Batch payments",
    href: "/batch-payments",
    icon: Layers,
  },
  {
    title: "Statements",
    href: "/statements",
    icon: FileText,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users2,
  },
];

const bottomNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = React.useState("");
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["Create a payment"]);

  React.useEffect(() => {
    setSearchParams(window.location.search);
  }, []);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    const hrefPath = href.split('?')[0];
    const hrefQuery = href.split('?')[1];
    
    if (hrefQuery) {
      const hrefParam = hrefQuery.split('&')[0].split('=')[0];
      const hrefValue = hrefQuery.split('=')[1];
      return pathname === hrefPath && searchParams.includes(hrefParam) && searchParams.includes(hrefValue);
    }
    if (pathname === hrefPath && searchParams) {
      return false;
    }
    return pathname.startsWith(hrefPath + "/") || pathname === hrefPath;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-white flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 px-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-gray-900 text-lg">Dashboard</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 rounded-md hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className={cn("space-y-1 px-2", collapsed && "px-1")}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isGroupExpanded = expandedGroups.includes(item.title);
            const itemActive = isActive(item.href);

            if (item.children) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isGroupExpanded && "rotate-90"
                        )}
                      />
                    )}
                  </button>
                  {isGroupExpanded && !collapsed && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.href);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              childActive
                                ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <ChildIcon className="h-4 w-4 shrink-0" />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  itemActive
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom items */}
      <div className="border-t border-gray-100 p-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const itemActive = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                itemActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
