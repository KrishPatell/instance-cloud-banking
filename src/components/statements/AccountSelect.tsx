"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAccounts } from "@/lib/context/AccountsContext";

interface AccountSelectProps {
  value?: string;
  onChange: (accountId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AccountSelect({
  value,
  onChange,
  placeholder = "Select an account",
  disabled = false,
}: AccountSelectProps) {
  const [open, setOpen] = React.useState(false);
  const { state } = useAccounts();
  
  const accounts = state.accounts.filter((acc) => acc.status === "open");
  const selectedAccount = accounts.find((acc) => acc.id === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Account <span className="text-destructive">*</span>
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between font-normal",
              !selectedAccount && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {selectedAccount ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedAccount.name}</span>
                <span className="text-muted-foreground text-xs">
                  {selectedAccount.currency} · {selectedAccount.availableBalance.toLocaleString()}
                </span>
                {selectedAccount.isPrimary && (
                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                    Primary
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search accounts..."
                className="flex-1 border-0 focus-visible:ring-0 h-9"
              />
            </div>
            <CommandList>
              <CommandEmpty>No account found.</CommandEmpty>
              <CommandGroup>
                {accounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    value={account.name}
                    onSelect={() => {
                      onChange(account.id);
                      setOpen(false);
                    }}
                    className="flex items-start gap-2 py-3"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4",
                        account.id === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{account.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {account.currency} · {account.availableBalance.toLocaleString()}
                      </span>
                    </div>
                    {account.isPrimary && (
                      <Badge variant="secondary" className="ml-auto text-xs bg-primary/20 text-primary">
                        Primary
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
