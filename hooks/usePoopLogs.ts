import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface PoopLog {
  id: string;
  user_id: string;
  dog_name: string;
  location?: string;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export const usePoopLogs = () => {
  const { user, isLoaded } = useUser();
  const [poopLogs, setPoopLogs] = useState<PoopLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPoopLogs = async () => {
    try {
      setIsLoadingData(true);
      setError(null);

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

  const logPoop = async (dogId: string, poopTime?: string) => {
    if (!user) {
      setError('Please sign in to log poops.');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/poops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dog_id: dogId,
          location: '',
          notes: '',
          poop_time: poopTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPoopLogs(prevLogs => [data.poop, ...prevLogs]);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to log poop');
        return false;
      }
    } catch (error) {
      console.error('Error logging poop:', error);
      setError('Failed to log poop. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoop = async (logId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/poops/${logId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPoopLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete poop log');
        return false;
      }
    } catch (error) {
      console.error('Error deleting poop:', error);
      setError('Failed to delete poop log. Please try again.');
      return false;
    }
  };

  // Load poop logs when user is loaded
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        loadPoopLogs();
      } else {
        setIsLoadingData(false);
      }
    }
  }, [isLoaded, user]);

  return {
    poopLogs,
    isLoading,
    isLoadingData,
    error,
    logPoop,
    deletePoop,
    loadPoopLogs,
  };
};
