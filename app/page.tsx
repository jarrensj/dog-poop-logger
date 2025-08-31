'use client';

import { useState, useEffect } from 'react';
import { SignedIn, useUser } from '@clerk/nextjs';
import { Calendar } from '@/components/ui/calendar';
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface PoopLog {
  id: string;
  user_id: string;
  dog_name: string;
  location?: string;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const [poopLogs, setPoopLogs] = useState<PoopLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dogName, setDogName] = useState('My Dog'); // Default dog name

  // Load poop logs when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      loadPoopLogs();
    }
  }, [isLoaded, user]);

  const loadPoopLogs = async () => {
    try {
      setIsLoadingData(true);
      setError(null);

      // Load poop logs
      const logsResponse = await fetch('/api/poops');
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setPoopLogs(logsData.poops || []);
      } else {
        setError('Failed to load poop logs. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error loading poop logs:', error);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Set default date and time when advanced mode is enabled
  useEffect(() => {
    if (isAdvancedMode && !customDate && !customTime) {
      const now = new Date();
      // Use local date methods to avoid timezone issues
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`; // YYYY-MM-DD format
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`; // HH:MM format
      
      setCustomDate(today);
      setCustomTime(currentTime);
    }
  }, [isAdvancedMode, customDate, customTime]);

  const logPoop = async () => {
    if (!user) {
      setError('Please sign in to log poops.');
      return;
    }

    setIsLoading(true);
    setIsCelebrating(true);
    setError(null);
    
    try {
      let poopTime: string | undefined;
      
      if (isAdvancedMode && customDate && customTime) {
        // Use custom date and time
        const customDateTime = new Date(`${customDate}T${customTime}`);
        poopTime = customDateTime.toISOString();
      }
      // If no custom time, let the API use current timestamp
      
      const response = await fetch('/api/poops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dog_name: dogName,
          location: '', // Can be extended later
          notes: '', // Can be extended later
          poop_time: poopTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPoopLogs(prevLogs => [data.poop, ...prevLogs]);

        // Reset advanced mode inputs after logging
        if (isAdvancedMode) {
          setCustomDate('');
          setCustomTime('');
          setIsAdvancedMode(false);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to log poop');
      }
    } catch (error) {
      console.error('Error logging poop:', error);
      setError('Failed to log poop. Please try again.');
    } finally {
      // Reset loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // 500ms
      
      // Reset celebration animation
      setTimeout(() => {
        setIsCelebrating(false);
      }, 1200); // 1.2s for full animation
    }
  };



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

    try {
      setError(null);
      const response = await fetch(`/api/poops/${logToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPoopLogs(prevLogs => prevLogs.filter(log => log.id !== logToDelete));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete poop log');
      }
    } catch (error) {
      console.error('Error deleting poop:', error);
      setError('Failed to delete poop log. Please try again.');
    } finally {
      closeDeleteModal();
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      dayOfWeek: date.toLocaleDateString([], { weekday: 'long' }),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Get logs for a specific date
  const getLogsForDate = (date: Date) => {
    const dateString = date.toDateString();
    return poopLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.toDateString() === dateString;
    });
  };

  // Get dates that have logs
  const getDatesWithLogs = () => {
    const dates = new Set<string>();
    poopLogs.forEach(log => {
      const logDate = new Date(log.created_at);
      dates.add(logDate.toDateString());
    });
    return Array.from(dates).map(dateString => new Date(dateString));
  };

  // Check if a date has logs
  const dateHasLogs = (date: Date) => {
    const dateString = date.toDateString();
    return poopLogs.some(log => {
      const logDate = new Date(log.created_at);
      return logDate.toDateString() === dateString;
    });
  };

  // Get poops for current month
  const getPoopsThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return poopLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    }).length;
  };

  // Show loading spinner while data is loading
  if (isLoadingData) {
    return (
      <main className="min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-0 pb-4 sm:pb-6 flex flex-col items-center justify-center textured-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-green)] mx-auto mb-4"></div>
          <p className="text-lg text-lighter font-noto font-light">Loading your poop logs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-0 pb-4 sm:pb-6 flex flex-col items-center justify-start textured-bg">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-zen font-light mb-6 sm:mb-8 text-[var(--foreground)] text-center tracking-wide">dog poop logger</h1>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl w-full mx-4 sm:mx-0">
          <p className="font-noto font-light">{error}</p>
        </div>
      )}
      
      <SignedIn>
        <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12 max-w-4xl w-full mx-4 sm:mx-0 fade-in">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-lg sm:text-xl mb-4 text-lighter font-noto font-light">Track your dog&apos;s poops</p>
            
            {/* Dog Name Input */}
            <div className="max-w-xs mx-auto">
              <label className="block text-sm font-noto font-light text-[var(--foreground)] mb-2">
                Dog Name
              </label>
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                className="w-full px-4 py-2 border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] text-center font-light transition-colors duration-300"
                placeholder="Enter dog name"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <button
                onClick={logPoop}
                disabled={isLoading || (isAdvancedMode && (!customDate || !customTime))}
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

            {/* Subtle Advanced Mode Toggle */}
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

          {poopLogs.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                  {/* Calendar */}
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-xs sm:max-w-sm">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={{
                          hasLogs: getDatesWithLogs()
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
                  
                  {/* Selected Date Logs */}
                  <div className="">
                    {selectedDate ? (
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
                              {getLogsForDate(selectedDate).length} {getLogsForDate(selectedDate).length === 1 ? 'poop' : 'poops'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-[var(--accent-light)] sketch-border p-4 sm:p-6 max-h-72 sm:max-h-80 overflow-y-auto softer-shadow">
                          {getLogsForDate(selectedDate).length > 0 ? (
                            getLogsForDate(selectedDate).map((log) => {
                              const { time, relative } = formatDateTime(log.created_at);
                              return (
                                <div key={log.id} className="bg-[var(--background)] rounded-sketch p-4 mb-3 softer-shadow border-l-4 border-[var(--accent-green)]">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                                    <div className="flex-1">
                                      <p className="font-noto font-light text-[var(--foreground)] text-lg">Poop logged!</p>
                                      <p className="text-lighter text-sm font-noto font-light">at {time}</p>
                                      <p className="text-lightest text-xs font-noto font-light">{relative}</p>
                                    </div>
                                    <button
                                      onClick={() => openDeleteModal(log.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white font-noto font-light py-2 px-4 text-sm transition-all duration-300 ease-out min-h-[40px] w-full sm:w-auto sm:ml-4 rounded-lg relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2 border-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-10">
                              <p className="text-lightest font-noto font-light text-lg">No logs for this date</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-lightest text-xl font-noto font-light">Select a date to view logs</p>
                        <p className="text-lightest text-sm mt-3 font-noto font-light opacity-70">
                          Dates with logs are highlighted in green
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-base text-lighter font-noto font-light">
                    Poops this month: {getPoopsThisMonth()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SignedIn>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[var(--background)] bg-opacity-85 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 max-w-sm w-full">
            <h3 className="text-xl font-zen font-light text-[var(--foreground)] mb-4 sm:mb-6 tracking-wide">
              Delete Poop Log?
            </h3>
            <p className="text-lighter mb-6 sm:mb-8 text-sm sm:text-base font-noto font-light leading-relaxed">
              Are you sure you want to delete this poop log? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-3 text-lighter hover:text-[var(--foreground)] font-light transition-all duration-300 ease-out border-[1.5px] border-[var(--border-soft)] rounded-sketch order-2 sm:order-1 bg-[var(--background)] hover:bg-[var(--accent-lighter)] relative hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-noto font-light rounded-lg transition-all duration-300 ease-out order-1 sm:order-2 border-0 relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}