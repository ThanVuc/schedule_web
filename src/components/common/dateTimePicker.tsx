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
import { ScrollArea} from "@/components/ui/scroll-area";
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

  const initialDate =
    defaultValue !== undefined && defaultValue !== null
      ? new Date(defaultValue)
      : new Date();

  const [date, setDate] = useState<Date>(
    isNaN(initialDate.getTime()) ? new Date() : initialDate
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      const d = new Date(defaultValue);
      if (!isNaN(d.getTime())) setDate(d);
    }
  }, [defaultValue]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const newDate = new Date(date);

    if (type === "hour") {
      let hour = parseInt(value);
      if (hour === 12) hour = 0;

      const isPM = newDate.getHours() >= 12;

      newDate.setHours(hour + (isPM ? 12 : 0));
    }

    if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    }

    if (type === "ampm") {
      const currentHour = newDate.getHours();
      if (value === "PM" && currentHour < 12) {
        newDate.setHours(currentHour + 12);
      } else if (value === "AM" && currentHour >= 12) {
        newDate.setHours(currentHour - 12);
      }
    }

    setDate(newDate);
    if (disabledDate) {
      onChange?.(formatDate.dateToNumber(newDate) ?? undefined);
    }
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
              <div className="flex items-center p-2 h-full border-r-2 pr-2 mr-2">
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
            initialFocus
            disabled={disabledDate ? () => true : undefined}
            onSelect={(d) => {
              if (!d) return;
              setDate(d);

              if (!disabledDate) {
                onChange?.(formatDate.dateToNumber(d) ?? undefined);
                setIsOpen(false);
              }
            }}
          />

          {/* Time picker */}
          {!disabledTime && (
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              {/* Hour */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {[...hours].map((hour) => {
                    const displayHour = hour.toString();
                    const selectedHour =
                      date.getHours() % 12 === hour % 12 || 
                      (date.getHours() % 12 === 0 && hour === 12);

                    return (
                      <Button
                        key={hour}
                        size="icon"
                        variant={selectedHour ? "default" : "ghost"}
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange("hour", displayHour)}
                      >
                        {hour}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Minutes */}
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={date.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {/* AM/PM */}
              <ScrollArea>
                <div className="flex sm:flex-col p-2">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      variant={
                        (ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12)
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
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
