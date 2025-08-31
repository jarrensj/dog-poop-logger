'use client';

import { Calendar } from '@/components/ui/calendar';
import { PoopLog } from '@/hooks/usePoopLogs';
import { getDatesWithLogs } from '@/utils/dateUtils';

interface PoopCalendarProps {
  poopLogs: PoopLog[];
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
}

export default function PoopCalendar({ poopLogs, selectedDate, onSelectDate }: PoopCalendarProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-xs sm:max-w-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          modifiers={{
            hasLogs: getDatesWithLogs(poopLogs)
          }}
          modifiersStyles={{
            hasLogs: {
              backgroundColor: 'var(--accent-green)',
              color: 'var(--background)',
              fontWeight: '300',
              borderRadius: '8px'
            }
          }}
          className="sketch-border soft-shadow bg-[var(--background)] w-full p-2 sm:p-4"
        />
      </div>
    </div>
  );
}
