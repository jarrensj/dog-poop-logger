'use client';

import { PoopLog } from '@/hooks/usePoopLogs';
import { getLogsForDate } from '@/utils/dateUtils';
import PoopLogEntry from './PoopLogEntry';

interface DateLogsViewProps {
  selectedDate?: Date;
  poopLogs: PoopLog[];
  onDeleteLog: (logId: string) => void;
  totalLogs: number;
}

export default function DateLogsView({ 
  selectedDate, 
  poopLogs, 
  onDeleteLog, 
  totalLogs 
}: DateLogsViewProps) {
  if (!selectedDate) {
    return (
      <div className="text-center py-16">
        <p className="text-lightest text-xl font-noto font-light">Select a date to view logs</p>
        <p className="text-lightest text-sm mt-3 font-noto font-light opacity-70">
          {totalLogs > 0 
            ? "Dates with logs are highlighted in green"
            : "Start logging poops to see them highlighted on the calendar"
          }
        </p>
      </div>
    );
  }

  const logsForDate = getLogsForDate(selectedDate, poopLogs);

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3">
          <h3 className="text-lg sm:text-xl font-zen font-light text-[var(--foreground)] text-center tracking-wide">
            {selectedDate.toLocaleDateString([], { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <span className="bg-[var(--accent-light)] text-[var(--foreground)] px-4 py-2 rounded-full text-sm font-light border-[1.5px] border-[var(--border-soft)]">
            {logsForDate.length} {logsForDate.length === 1 ? 'poop' : 'poops'}
          </span>
        </div>
      </div>
      
      <div className="bg-[var(--accent-light)] sketch-border p-4 sm:p-6 max-h-72 sm:max-h-80 overflow-y-auto softer-shadow">
        {logsForDate.length > 0 ? (
          logsForDate.map((log) => (
            <PoopLogEntry 
              key={log.id} 
              log={log} 
              onDelete={onDeleteLog} 
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-lightest font-noto font-light text-lg">No logs for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}
