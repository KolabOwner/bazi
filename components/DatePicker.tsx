'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatePicker({ value, onChange, open, onOpenChange }: DatePickerProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || currentYear);
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
  const [selectedHour, setSelectedHour] = useState(value?.getHours() || 0);
  const [selectedMinute, setSelectedMinute] = useState(value?.getMinutes() || 0);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 601 }, (_, i) => 1700 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const scrollToCenter = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
          if (ref.current) {
            const itemHeight = 34;
            const containerHeight = 200;
            const scrollTop = itemHeight * index - (containerHeight - itemHeight) / 2;
            ref.current.scrollTop = scrollTop;
          }
        };

        scrollToCenter(yearRef, years.indexOf(selectedYear));
        scrollToCenter(monthRef, selectedMonth);
        scrollToCenter(dayRef, selectedDay - 1);
        scrollToCenter(hourRef, selectedHour);
        scrollToCenter(minuteRef, selectedMinute);
      }, 100);
    }
  }, [open]); // Only trigger when modal opens, not on state changes

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute);
    onChange(newDate);
    onOpenChange(false);
  };

  const createScrollHandler = (
    setter: (value: number) => void,
    values: number[],
    offset: number = 0
  ) => {
    let scrollTimeout: NodeJS.Timeout;
    
    return (event: React.UIEvent<HTMLDivElement>) => {
      clearTimeout(scrollTimeout);
      const target = event.currentTarget;
      
      scrollTimeout = setTimeout(() => {
        if (!target) return;
        
        const itemHeight = 34;
        const scrollTop = target.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const value = values[Math.max(0, Math.min(index, values.length - 1))];
        setter(value + offset);
      }, 100);
    };
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-8 pb-[47px] shadow-lg">
          <VisuallyHidden.Root>
            <Dialog.Title>Select Birth Date and Time</Dialog.Title>
            <Dialog.Description>
              Choose your birth date and time using the scroll wheels below
            </Dialog.Description>
          </VisuallyHidden.Root>
          <div className="mb-5 flex justify-between">
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer text-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="cursor-pointer text-blue-600"
            >
              Confirm
            </button>
          </div>
          
          <div className="grid w-[376px] grid-cols-5 text-center">
            <div
              ref={yearRef}
              className="hide-scrollbar relative h-[200px] snap-y snap-mandatory overflow-y-scroll"
              onScroll={createScrollHandler(setSelectedYear, years)}
            >
              <div className="h-[90px] w-full"></div>
              {years.map((year) => (
                <div
                  key={year}
                  className={cn(
                    "box-content flex h-[34px] cursor-pointer snap-center items-center justify-center",
                    year === selectedYear ? "text-blue-600" : "text-gray-400"
                  )}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </div>
              ))}
              <div className="h-[120px] w-full"></div>
            </div>

            <div
              ref={monthRef}
              className="hide-scrollbar relative h-[200px] snap-y snap-mandatory overflow-y-scroll"
              onScroll={createScrollHandler(setSelectedMonth, months, -1)}
            >
              <div className="h-[90px] w-full"></div>
              {months.map((month) => (
                <div
                  key={month}
                  className={cn(
                    "box-content flex h-[34px] cursor-pointer snap-center items-center justify-center",
                    month === selectedMonth + 1 ? "text-blue-600" : "text-gray-400"
                  )}
                  onClick={() => setSelectedMonth(month - 1)}
                >
                  {month}
                </div>
              ))}
              <div className="h-[120px] w-full"></div>
            </div>

            <div
              ref={dayRef}
              className="hide-scrollbar relative h-[200px] snap-y snap-mandatory overflow-y-scroll"
              onScroll={createScrollHandler(setSelectedDay, days)}
            >
              <div className="h-[90px] w-full"></div>
              {days.map((day) => (
                <div
                  key={day}
                  className={cn(
                    "box-content flex h-[34px] cursor-pointer snap-center items-center justify-center",
                    day === selectedDay ? "text-blue-600" : "text-gray-400"
                  )}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              ))}
              <div className="h-[120px] w-full"></div>
            </div>

            <div
              ref={hourRef}
              className="hide-scrollbar relative h-[200px] snap-y snap-mandatory overflow-y-scroll"
              onScroll={createScrollHandler(setSelectedHour, hours)}
            >
              <div className="h-[90px] w-full"></div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={cn(
                    "box-content flex h-[34px] cursor-pointer snap-center items-center justify-center",
                    hour === selectedHour ? "text-blue-600" : "text-gray-400"
                  )}
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
              <div className="h-[120px] w-full"></div>
            </div>

            <div
              ref={minuteRef}
              className="hide-scrollbar relative h-[200px] snap-y snap-mandatory overflow-y-scroll"
              onScroll={createScrollHandler(setSelectedMinute, minutes)}
            >
              <div className="h-[90px] w-full"></div>
              {minutes.map((minute) => (
                <div
                  key={minute}
                  className={cn(
                    "box-content flex h-[34px] cursor-pointer snap-center items-center justify-center",
                    minute === selectedMinute ? "text-blue-600" : "text-gray-400"
                  )}
                  onClick={() => setSelectedMinute(minute)}
                >
                  {minute.toString().padStart(2, '0')}
                </div>
              ))}
              <div className="h-[120px] w-full"></div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}