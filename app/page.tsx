'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { usePoopLogs } from '@/hooks/usePoopLogs';
import { useDogs } from '@/hooks/useDogs';
import { getPoopsThisMonth } from '@/utils/dateUtils';
import PoopLogger from '@/components/PoopLogger';
import PoopCalendar from '@/components/PoopCalendar';
import DateLogsView from '@/components/DateLogsView';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const { poopLogs, isLoading, isLoadingData, error, logPoop, deletePoop } = usePoopLogs();
  const { primaryDog, isLoading: isLoadingDogs } = useDogs();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  const openDeleteModal = (logId: string) => {
    setLogToDelete(logId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setLogToDelete(null);
  };

  const confirmDelete = async () => {
    if (!logToDelete) return;
    
    const success = await deletePoop(logToDelete);
    if (success) {
      closeDeleteModal();
    }
  };

  // Show loading spinner while data is loading
  if (isLoadingData || isLoadingDogs) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-0 pb-4 sm:pb-6 flex flex-col items-center justify-start textured-bg">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-zen font-light text-[var(--foreground)] text-center tracking-wide">dog poop logger</h1>
          <span className="bg-[var(--accent-green)] text-[var(--background)] text-xs sm:text-sm font-noto font-medium px-2 py-1 rounded-full uppercase tracking-wide">
            wip
          </span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && <ErrorMessage message={error} />}
      
      <SignedIn>
        <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-0 fade-in">
          <PoopLogger 
            dogId={primaryDog?.id}
            dogName={primaryDog?.name || 'My Dog'}
            onLogPoop={logPoop}
            isLoading={isLoading}
            selectedDate={selectedDate}
          />

          <div className="mt-8 sm:mt-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Calendar */}
              <PoopCalendar 
                poopLogs={poopLogs}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              
              {/* Selected Date Logs */}
              <DateLogsView 
                selectedDate={selectedDate}
                poopLogs={poopLogs}
                onDeleteLog={openDeleteModal}
                totalLogs={poopLogs.length}
              />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-base text-lighter font-noto font-light">
                Poops this month: {getPoopsThisMonth(poopLogs)}
              </p>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-0 fade-in">
          <div className="text-center py-16">
            <p className="text-xl sm:text-2xl text-lighter font-noto font-light mb-6">
              dog poop logger
            </p>
            <p className="text-base text-lighter font-noto font-light mb-8 leading-relaxed">
              Sign in to start tracking your dog&apos;s bathroom habits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <p className="text-sm text-lightest font-noto font-light">
                Ready to get started? Sign in or create an account using the buttons in the top right corner.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>

      <DeleteConfirmationModal 
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </main>
  );
}