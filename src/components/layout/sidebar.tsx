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
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  {
    title: "Dashboard",
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

export function Sidebar({ collapsed: initialCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = React.useState("");
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["Create a payment"]);
  const [isHovered, setIsHovered] = React.useState(false);

  // Get search params on mount
  React.useEffect(() => {
    setSearchParams(window.location.search);
  }, []);

  // On hover, expand; otherwise use initial state
  const isExpanded = isHovered || initialCollapsed === false;
  
  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    const hrefPath = href.split('?')[0];
    const hrefQuery = href.split('?')[1];
    
    // If href has query params, check exact match with query params
    if (hrefQuery) {
      // Extract the key parameter (tab or type)
      const hrefParam = hrefQuery.split('&')[0].split('=')[0];
      const hrefValue = hrefQuery.split('=')[1];
      // Check if pathname matches AND the query param matches
      return pathname === hrefPath && searchParams.includes(hrefParam) && searchParams.includes(hrefValue);
    }
    // For base paths without query params - don't match if we're on a child route with query
    if (pathname === hrefPath && searchParams) {
      return false;
    }
    return pathname.startsWith(hrefPath + "/") || pathname === hrefPath;
  };

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen border-r bg-[hsl(222_47%_8%)] transition-all duration-200 ease-out"
      style={{ width: isExpanded ? "240px" : "64px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Grid3X3 className="h-5 w-5 text-slate-900" />
            </div>
            <span 
              className={cn(
                "font-serif font-bold text-xl text-white whitespace-nowrap overflow-hidden transition-all duration-200",
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}
            >
              STVBLE
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isGroupExpanded = expandedGroups.includes(item.title);
              const itemActive = isActive(item.href);

              if (item.children) {
                // Dropdown group
                return (
                  <div key={item.title}>
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "text-slate-400 hover:bg-white/5 hover:text-white",
                      )}
                      style={{
                        color: isGroupExpanded ? "#ffffff" : "#94a3b8",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        <span 
                          className={cn(
                            "whitespace-nowrap overflow-hidden transition-all duration-200",
                            isExpanded ? "opacity-100" : "opacity-0 w-0"
                          )}
                        >
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isExpanded && "rotate-90"
                        )}
                        style={{
                          transform: isGroupExpanded && isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          opacity: isExpanded ? 1 : 0,
                        }}
                      />
                    </button>
                    {isGroupExpanded && isExpanded && (
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
                                childActive && "bg-white/10 text-white"
                              )}
                              style={{
                                color: childActive ? "#ffffff" : "#94a3b8",
                              }}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span className="whitespace-nowrap">{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular nav item
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-white/5 hover:text-white",
                    itemActive && "bg-white/10 text-white border-l-2 border-white"
                  )}
                  style={{
                    color: itemActive ? "#ffffff" : "#94a3b8",
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span 
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-200",
                      isExpanded ? "opacity-100" : "opacity-0 w-0"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Bottom items */}
        <div className="border-t border-white/10 p-2">
          <Separator className="mb-2 bg-white/10" />
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const itemActive = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-white/5 hover:text-white",
                  itemActive && "bg-white/10 text-white"
                )}
                style={{
                  color: itemActive ? "#ffffff" : "#94a3b8",
                }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span 
                  className={cn(
                    "whitespace-nowrap overflow-hidden transition-all duration-200",
                    isExpanded ? "opacity-100" : "opacity-0 w-0"
                  )}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// Need ChevronRight icon
function ChevronRight({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
