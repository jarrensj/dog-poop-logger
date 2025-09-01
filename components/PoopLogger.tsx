'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useAdvancedMode } from '@/hooks/useAdvancedMode';

interface PoopLoggerProps {
  dogName: string;
  onLogPoop: (dogName: string, poopTime?: string) => Promise<boolean>;
  isLoading: boolean;
  selectedDate?: Date;
}

export default function PoopLogger({ 
  dogName, 
  onLogPoop, 
  isLoading, 
  selectedDate 
}: PoopLoggerProps) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  const {
    isAdvancedMode,
    setIsAdvancedMode,
    customDate,
    setCustomDate,
    customTime,
    setCustomTime,
    getCustomDateTime,
    resetAdvancedMode,
    isValid,
  } = useAdvancedMode(selectedDate);

  const handleLogPoop = async () => {
    setIsCelebrating(true);
    
    const success = await onLogPoop(dogName, getCustomDateTime());
    
    if (success && isAdvancedMode) {
      resetAdvancedMode();
    }

    // Reset celebration animation
    setTimeout(() => {
      setIsCelebrating(false);
    }, 1200);
  };

  return (
    <div className="text-center mb-6 sm:mb-8">
      <p className="text-lg sm:text-xl mb-4 text-lighter font-noto font-light">Track {dogName}&apos;s poops</p>

      <div className="flex flex-col items-center">
        <div className="relative">
          <button
            onClick={handleLogPoop}
            disabled={isLoading || !isValid}
            className={`bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] disabled:bg-[var(--foreground-lighter)] text-[var(--background)] font-noto font-light py-4 px-8 sm:py-5 sm:px-10 text-lg sm:text-xl transition-all duration-300 ease-out mb-4 w-full sm:w-auto min-h-[56px] rounded-xl relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[var(--accent-green)]/20 flex items-center justify-center gap-2 border-0 ${isCelebrating ? 'celebrate-button' : ''}`}
          >
            {isLoading ? 'Logging...' : 'Log Poop'}
          </button>
          
          {/* Celebration particles */}
          {isCelebrating && (
            <>
              <div className="celebration-particle"></div>
              <div className="celebration-particle"></div>
              <div className="celebration-particle"></div>
              <div className="celebration-particle"></div>
              <div className="celebration-particle"></div>
            </>
          )}
        </div>

        {/* Advanced Mode Toggle */}
        <div className="mb-8 sm:mb-10">
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="text-sm text-[var(--accent-green)] hover:text-[var(--accent-green-hover)] transition-colors duration-300 px-4 py-3 font-noto font-light underline hover:no-underline border border-transparent hover:border-[var(--border-soft)] rounded-sketch hover:bg-[var(--accent-lighter)] cursor-pointer relative z-10 flex items-center gap-2"
            type="button"
          >
            <Clock className="w-4 h-4" />
            {isAdvancedMode ? '× Cancel custom time' : 'Log for a different time?'}
          </button>
        </div>

        {/* Advanced Mode Inputs */}
        {isAdvancedMode && (
          <div className="mb-8 sm:mb-10 p-4 sm:p-6 bg-[var(--accent-light)] border-[1.5px] border-[var(--border-soft)] rounded-sketch w-full softer-shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-noto font-light text-[var(--foreground)] mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-4 py-3 border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] text-base min-h-[52px] font-light transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-noto font-light text-[var(--foreground)] mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-4 py-3 border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] text-base min-h-[52px] font-light transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
