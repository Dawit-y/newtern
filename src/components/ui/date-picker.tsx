"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Controller, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  control: Control; // from useForm
  name: string; // field name
  label?: string; // optional label
  placeholder?: string; // optional placeholder text
}

export function DatePicker({
  control,
  name,
  label = "Select date",
  placeholder = "Pick a date",
}: DatePickerProps) {
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
          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id={name}
                  className="w-48 justify-between font-normal"
                >
                  {value ? new Date(value).toLocaleDateString() : placeholder}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => {
                    onChange(date?.toISOString()); // save as ISO string
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
