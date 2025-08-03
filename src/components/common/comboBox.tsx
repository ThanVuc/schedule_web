"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

export interface ComboBoxItem {
  value: string;
  label: string;
}

export interface AppComboBoxProps {
  items: ComboBoxItem[];
  value: string;
  onChange: (value: string) => void;
  emptyText?: string;
  placeholder?: string;
  title?: string;
}

export function AppComboBox({
  items,
  value,
  onChange,
  emptyText = "Không tìm thấy kết quả",
  placeholder = "Tìm kiếm...",
  title = "Chọn...",
}: AppComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[510px] justify-between"
          type="button"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : title}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[510px] p-0 z-200">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const selected = currentValue === value ? "" : currentValue;
                    onChange(selected);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
