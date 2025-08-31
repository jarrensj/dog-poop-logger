'use client';

import { useState, useEffect } from 'react';
import { SignedIn } from '@clerk/nextjs';

interface PoopLog {
  id: string;
  timestamp: string;
}

export default function Home() {
  const [poopLogs, setPoopLogs] = useState<PoopLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load poop logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('poopLogs');
    if (savedLogs) {
      setPoopLogs(JSON.parse(savedLogs));
    }
  }, []);

  const logPoop = () => {
    setIsLoading(true);
    
    const now = new Date();
    const newLog: PoopLog = {
      id: Date.now().toString(),
      timestamp: now.toISOString()
    };

    const updatedLogs = [newLog, ...poopLogs];
    setPoopLogs(updatedLogs);
    localStorage.setItem('poopLogs', JSON.stringify(updatedLogs));

    // Reset loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500ms
  };

  const clearLogs = () => {
    setPoopLogs([]);
    localStorage.removeItem('poopLogs');
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
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

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">dog poop logger</h1>

      <SignedIn>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <p className="text-lg mb-6 text-gray-600 text-center">Track your dog&apos;s bathroom breaks</p>
          
          <div className="flex justify-center">
            <button
              onClick={logPoop}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 mb-8 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Logging...' : 'Log Poop'}
            </button>
          </div>

          {poopLogs.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Recent Logs</h2>
                <button
                  onClick={clearLogs}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                {poopLogs.map((log) => {
                  const { date, time, relative } = formatDateTime(log.timestamp);
                  return (
                    <div key={log.id} className="bg-white rounded-md p-4 mb-3 shadow-sm border-l-4 border-blue-500">
                      <div className="flex justify-between items-center">
                        <div className="">
                          <p className="font-semibold text-gray-800">Poop logged!</p>
                          <p className="text-gray-600 text-sm">{date} at {time}</p>
                          <p className="text-gray-400 text-xs">{relative}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Total logs: {poopLogs.length}
              </p>
            </div>
          )}
        </div>
      </SignedIn>
    </main>
  );
}