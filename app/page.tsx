'use client';

import { useState, useEffect } from 'react';
import { SignedIn } from '@clerk/nextjs';
import { Calendar } from '@/components/ui/calendar';

interface PoopLog {
  id: string;
  userId: string;
  name: string;
  location?: string;
  timestamp: string;
}

export default function Home() {
  const [poopLogs, setPoopLogs] = useState<PoopLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  // Load poop logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('poopLogs');
    if (savedLogs) {
      setPoopLogs(JSON.parse(savedLogs));
    }
  }, []);

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

  const logPoop = () => {
    setIsLoading(true);
    
    let logTimestamp: Date;
    
    if (isAdvancedMode && customDate && customTime) {
      // Use custom date and time
      const customDateTime = new Date(`${customDate}T${customTime}`);
      logTimestamp = customDateTime;
    } else {
      // Use current date and time
      logTimestamp = new Date();
    }
    
    const newLog: PoopLog = {
      id: Date.now().toString(),
      userId: 'user1', // TODO
      name: 'dog1', // TODO
      timestamp: logTimestamp.toISOString()
    };

    const updatedLogs = [newLog, ...poopLogs];
    setPoopLogs(updatedLogs);
    localStorage.setItem('poopLogs', JSON.stringify(updatedLogs));

    // Reset advanced mode inputs after logging
    if (isAdvancedMode) {
      setCustomDate('');
      setCustomTime('');
      setIsAdvancedMode(false);
    }

    // Reset loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500ms
  };



  const openDeleteModal = (logId: string) => {
    setLogToDelete(logId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setLogToDelete(null);
  };

  const confirmDelete = () => {
    if (logToDelete) {
      const updatedLogs = poopLogs.filter(log => log.id !== logToDelete);
      setPoopLogs(updatedLogs);
      localStorage.setItem('poopLogs', JSON.stringify(updatedLogs));
    }
    closeDeleteModal();
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
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === dateString;
    });
  };

  // Get dates that have logs
  const getDatesWithLogs = () => {
    const dates = new Set<string>();
    poopLogs.forEach(log => {
      const logDate = new Date(log.timestamp);
      dates.add(logDate.toDateString());
    });
    return Array.from(dates).map(dateString => new Date(dateString));
  };

  // Check if a date has logs
  const dateHasLogs = (date: Date) => {
    const dateString = date.toDateString();
    return poopLogs.some(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === dateString;
    });
  };

  // Get poops for current month
  const getPoopsThisMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return poopLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
    }).length;
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start sm:justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 text-center mt-4 sm:mt-0">dog poop logger</h1>

      <SignedIn>
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-2 sm:mx-0">
          <p className="text-base sm:text-lg mb-4 sm:mb-6 text-gray-600 text-center">Track your dog&apos;s poops</p>
          

          
          <div className="flex flex-col items-center">
            <button
              onClick={logPoop}
              disabled={isLoading || (isAdvancedMode && (!customDate || !customTime))}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors duration-200 mb-3 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none w-full sm:w-auto min-h-[48px]"
            >
              {isLoading ? 'Logging...' : 'Log Poop'}
            </button>

            {/* Subtle Advanced Mode Toggle */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 px-2 py-1"
              >
                {isAdvancedMode ? '× Cancel custom time' : 'Log for a different time?'}
              </button>
            </div>

            {/* Advanced Mode Inputs */}
            {isAdvancedMode && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg border w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[48px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[48px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {poopLogs.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div>
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Calendar View</h2>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  {/* Calendar */}
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-sm">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={{
                          hasLogs: getDatesWithLogs()
                        }}
                        modifiersStyles={{
                          hasLogs: {
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontWeight: 'bold'
                          }
                        }}
                        className="rounded-md border shadow-sm w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Selected Date Logs */}
                  <div className="">
                    {selectedDate ? (
                      <div>
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                              {selectedDate.toLocaleDateString([], { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </h3>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                              {getLogsForDate(selectedDate).length} {getLogsForDate(selectedDate).length === 1 ? 'poop' : 'poops'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-64 sm:max-h-80 overflow-y-auto">
                          {getLogsForDate(selectedDate).length > 0 ? (
                            getLogsForDate(selectedDate).map((log) => {
                              const { time, relative } = formatDateTime(log.timestamp);
                              return (
                                <div key={log.id} className="bg-white rounded-md p-3 mb-2 shadow-sm border-l-4 border-blue-500">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-800">Poop logged!</p>
                                      <p className="text-gray-600 text-sm">at {time}</p>
                                      <p className="text-gray-400 text-xs">{relative}</p>
                                    </div>
                                    <button
                                      onClick={() => openDeleteModal(log.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors duration-200 min-h-[40px] w-full sm:w-auto sm:ml-4"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No logs for this date</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Select a date to view logs</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Dates with logs are highlighted in blue
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
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
        <div className="fixed inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Delete Poop Log?
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this poop log? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 border border-gray-300 rounded sm:border-none order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-3 sm:py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded transition-colors duration-200 order-1 sm:order-2"
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