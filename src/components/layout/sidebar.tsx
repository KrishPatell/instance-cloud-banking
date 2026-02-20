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
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  LayoutDashboard,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    title: "Stivble",
    href: "/stivble",
    icon: Building2,
    hasChevron: true,
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
        href: "/transfers/create",
        icon: ArrowLeftRight,
      },
      {
        title: "Create currency exchange",
        href: "/exchange/create",
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
        label: "Sandbox",
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
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["Create a payment"]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
        style={{
          backgroundColor: "hsl(222 47% 8%)",
          borderRight: "1px solid hsl(222 30% 15%)",
        }}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 items-center border-b px-3",
            collapsed ? "justify-center" : "justify-between"
          )}
          style={{ borderColor: "hsl(222 30% 15%)" }}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-white" />
              <span className="font-serif font-bold text-white text-xl">STVBLE</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              collapsed && "absolute -right-3 top-3 h-6 w-6 rounded-full border shadow-md bg-[hsl(222_47%_8%)] text-white hover:bg-white/10"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {collapsed && (
          <div className="flex justify-center border-b py-3" style={{ borderColor: "hsl(222 30% 15%)" }}>
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const itemActive = isActive(item.href);

              // Handle groups with children
              if (item.children) {
                const isExpanded = expandedGroups.includes(item.title);

                if (collapsed) {
                  return (
                    <Tooltip key={item.title}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md",
                            itemActive && "bg-primary/10 text-primary"
                          )}
                          style={{
                            color: itemActive ? "hsl(var(--primary))" : "#94a3b8",
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <div key={item.title}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-medium",
                        "hover:bg-white/5 hover:text-white",
                        itemActive && "bg-primary/10 text-primary"
                      )}
                      style={{
                        color: itemActive ? "hsl(var(--primary))" : "#94a3b8",
                      }}
                      onClick={() => toggleGroup(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        {item.title}
                      </div>
                      <ChevronRight
                        className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
                      />
                    </Button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                "hover:bg-white/5 hover:text-white",
                                childActive && "bg-primary/10 text-primary"
                              )}
                              style={{
                                color: childActive ? "hsl(var(--primary))" : "#94a3b8",
                              }}
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span>{child.title}</span>
                              {child.label && (
                                <span
                                  className="ml-auto rounded bg-primary/20 px-1.5 py-0.5 text-xs font-semibold"
                                  style={{ color: "hsl(var(--primary))" }}
                                >
                                  {child.label}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Handle single items
              if (collapsed) {
                return (
                  <Tooltip key={item.href || item.title}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href || "#"}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                          itemActive && "bg-primary/10"
                        )}
                        style={{
                          color: itemActive ? "hsl(var(--primary))" : "#94a3b8",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.href || item.title}
                  href={item.href || "#"}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                    "hover:bg-white/5 hover:text-white",
                    itemActive && "bg-primary/10 text-primary border-l-2 border-primary"
                  )}
                  style={{
                    color: itemActive ? "hsl(var(--primary))" : "#94a3b8",
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                  {item.hasChevron && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div
          className={cn(
            "border-t px-3 py-4",
            collapsed && "flex flex-col items-center"
          )}
          style={{ borderColor: "hsl(222 30% 15%)" }}
        >
          {!collapsed && (
            <>
              <p className="text-xs text-muted-foreground/70">© 2026 Fuse Group Holdings Inc.</p>
              <button className="text-xs text-muted-foreground/50 hover:text-muted-foreground cursor-pointer mt-1">
                Privacy policy
              </button>
            </>
          )}
          {collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-xs text-muted-foreground/50 hover:text-muted-foreground cursor-pointer">
                  © 2026
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">© 2026 Fuse Group Holdings Inc.</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
