"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerFieldProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal gap-2",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            disabled={(date) => {
              if (maxDate && date > maxDate) return true;
              if (minDate && date < minDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      )}
    </div>
  );
}
