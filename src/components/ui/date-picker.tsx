"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
};

// Helper: safely parse stored value into Date
function parseDate(value: unknown): Date | undefined {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    return !isNaN(date.getTime()) ? date : undefined;
  }
  return undefined;
}

export function DatePicker<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label = "Select date",
  placeholder = "Pick a date",
}: DatePickerProps<TFieldValues>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor={name} className="px-1">
          {label}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const { value, onChange } = field;
          const selectedDate = parseDate(value);

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id={name}
                  className="w-48 justify-between font-normal"
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : placeholder}
                  <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={selectedDate}
                  onSelect={(date) => {
                    onChange(date?.toISOString() ?? null);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
}
