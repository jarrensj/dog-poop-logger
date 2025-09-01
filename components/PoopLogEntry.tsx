'use client';

import { Trash2 } from 'lucide-react';
import { PoopLog } from '@/hooks/usePoopLogs';
import { formatDateTime } from '@/utils/dateUtils';

interface PoopLogEntryProps {
  log: PoopLog;
  onDelete: (logId: string) => void;
}

export default function PoopLogEntry({ log, onDelete }: PoopLogEntryProps) {
  const { time, relative } = formatDateTime(log.created_at);

  return (
    <div className="bg-[var(--background)] rounded-sketch p-4 mb-3 softer-shadow border-l-4 border-[var(--accent-green)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="flex-1">
          <p className="font-noto font-light text-[var(--foreground)] text-lg">{log.dog_name} pooped</p>
          <p className="text-lighter text-sm font-noto font-light">at {time}</p>
          <p className="text-lightest text-xs font-noto font-light">{relative}</p>
        </div>
        <button
          onClick={() => onDelete(log.id)}
          className="bg-red-500 hover:bg-red-600 text-white font-noto font-light py-2 px-4 text-sm transition-all duration-300 ease-out min-h-[40px] w-full sm:w-auto sm:ml-4 rounded-lg relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 border-0"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
