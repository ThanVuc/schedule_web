"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { formatDate } from "@/app/(pages)/(main)/profile/utils";

interface DateTimePickerProps {
  title: string;
  defaultValue?: number;
  onChange?: (date: number | undefined) => void;
  icon?: React.ReactNode;
  disabledTime?: boolean;
  disabledDate?: boolean;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  defaultValue,
  onChange,
  title,
  disabledTime = true,
  disabledDate = false,
  icon,
}) => {
  const parsedDate = defaultValue ? new Date(defaultValue) : new Date();
  const [date, setDate] = useState<Date>(
    isNaN(parsedDate.getTime()) ? new Date() : parsedDate
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      const d = new Date(defaultValue);
      if (!isNaN(d.getTime())) setDate(d);
    }
  }, [defaultValue]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const newDate = new Date(date);

    if (type === "hour") {
      newDate.setHours(
        (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
      );
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      if (value === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (value === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }

    setDate(newDate);
    { disabledDate && onChange?.(formatDate.dateToNumber(newDate) ?? undefined); }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal !p-0",
            !date && "text-muted-foreground"
          )}
        >
          <div className="flex h-full w-full">
            {title && (
              <div className="flex items-center  p-2 h-full border-r-2 pr-2 mr-2">
                <span>{title}:</span>
              </div>
            )}

            <div className="flex items-center w-full justify-between p-2">
              {date ? (
                disabledTime
                  ? format(date, "dd/MM/yyyy")      
                  : format(date, "dd/MM/yyyy hh:mm aa") 
              ) : (
                <span>{disabledTime ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm aa"}</span>
              )}
              {icon && <span className="ml-2">{icon}</span>}
            </div>
          </div>
        </Button>

      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 z-160">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            disabled={disabledDate}
            initialFocus
            onSelect={(d) => {
              if (!d) return;
              setDate(d);
              if (!disabledDate) {
                onChange?.(formatDate.dateToNumber(d) ?? undefined);
              }
            }}
          />

          {!disabledTime && <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            {/* Hour */}
            <ScrollArea className="w-64 sm:w-auto"
            >
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea>
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                        ((ampm === "AM" && date.getHours() < 12) ||
                          (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>}
        </div>
      </PopoverContent>
    </Popover>
  );
};
