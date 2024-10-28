"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleX } from "lucide-react";

interface RangepickerProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function Rangepicker({ className, date, setDate }: RangepickerProps) {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const nextMonthEnd = endOfMonth(addMonths(now, 1));

  const clearDateRange = () => {
    setDate(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            aria-label="Select date range"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
            {date && (
              <Button
                variant="outline"
                className="ml-2 h-2 w-10"
                onClick={clearDateRange}
                aria-label="Clear date range"
              >
                <CircleX className="text-red-500 font-bolder h-3 w-4" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={currentMonthStart}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
