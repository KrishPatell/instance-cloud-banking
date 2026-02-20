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
  X,
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Command as CommandPrimitive, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandShortcut } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
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
  { label: "Create internal transfer", href: "/transfers/create", icon: ArrowLeftRight },
  { label: "Create currency exchange", href: "/exchange/create", icon: RefreshCw },
  { label: "Simulate inbound payment", href: "/sandbox", icon: FlaskConical },
];

export function Topbar({ onMenuClick, sidebarCollapsed = false }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [commandOpen, setCommandOpen] = React.useState(false);
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

  // Handle Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandSelect = (href: string) => {
    addToRecent(href);
    router.push(href);
    setCommandOpen(false);
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

        {/* Search with Cmd+K */}
        <div className="relative hidden flex-1 md:block md:max-w-xs lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <Input
            placeholder="Type a command or search..."
            readOnly
            className="cursor-pointer pl-9 pr-16"
            style={{
              backgroundColor: "hsl(var(--muted))",
              borderColor: "transparent",
            }}
            onClick={() => setCommandOpen(true)}
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

          {/* Notification Bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span 
                  className="absolute top-1 right-1 w-2 h-2 rounded-full" 
                  style={{ backgroundColor: "hsl(var(--destructive))" }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

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

      {/* Command Palette */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
          <CommandPrimitive>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput 
                placeholder="Type a command or search..." 
                className="flex-1 border-0 focus-visible:ring-0 h-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setCommandOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <CommandList className="max-h-[300px] p-2">
              <CommandEmpty>No results found.</CommandEmpty>
              
              <CommandGroup heading="Navigation">
                {navigationItems.map((item) => (
                  <CommandItem
                    key={item.href}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={() => handleCommandSelect(item.href)}
                  >
                    <item.icon className="h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup heading="Actions">
                {actionItems.map((item) => (
                  <CommandItem
                    key={item.href}
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={() => handleCommandSelect(item.href)}
                  >
                    <item.icon className="h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {recentPages.length > 0 && (
                <CommandGroup heading="Recent">
                  {recentPages.map((href) => (
                    <CommandItem
                      key={href}
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={() => handleCommandSelect(href)}
                    >
                      <Building2 className="h-4 w-4 opacity-70" />
                      <span>{href}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </CommandPrimitive>
        </DialogContent>
      </Dialog>
    </>
  );
}
