import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { apiCache } from '@/lib/cache';

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  picture_url?: string;
  created_at: string;
  updated_at: string;
}

export const useDogs = () => {
  const { user, isLoaded } = useUser();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dogs from API when user is loaded
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        loadDogs();
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, user]);

  const loadDogs = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `dogs_${user.id}`;
      const cachedData = apiCache.get<Dog[]>(cacheKey);
      
      if (cachedData) {
        setDogs(cachedData);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/dogs');
      if (response.ok) {
        const data = await response.json();
        const dogs = data.dogs || [];
        setDogs(dogs);
        
        // Cache for 30 days
        apiCache.set(cacheKey, dogs, 30 * 24 * 60);
      } else {
        setError('Failed to load dogs');
      }
    } catch (error) {
      console.error('Error loading dogs:', error);
      setError('Failed to load dogs');
    } finally {
      setIsLoading(false);
    }
  };

  const addDog = async (name: string, picture_url?: string) => {
    try {
      setError(null);
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, picture_url }),
      });

      if (response.ok) {
        const data = await response.json();
        setDogs(prevDogs => [...prevDogs, data.dog]);
        
        // Invalidate cache since we added a dog
        apiCache.invalidate(`dogs_${user?.id}`);
        
        return data.dog;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add dog');
        return null;
      }
    } catch (error) {
      console.error('Error adding dog:', error);
      setError('Failed to add dog');
      return null;
    }
  };

  const updateDog = async (id: string, name: string, picture_url?: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/dogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, picture_url }),
      });

      if (response.ok) {
        const data = await response.json();
        setDogs(prevDogs => prevDogs.map(dog => 
          dog.id === id ? data.dog : dog
        ));
        
        // Invalidate cache since we updated a dog
        apiCache.invalidate(`dogs_${user?.id}`);
        
        return data.dog;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update dog');
        return null;
      }
    } catch (error) {
      console.error('Error updating dog:', error);
      setError('Failed to update dog');
      return null;
    }
  };

  const deleteDog = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/dogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDogs(prevDogs => prevDogs.filter(dog => dog.id !== id));
        
        // Invalidate cache since we deleted a dog
        apiCache.invalidate(`dogs_${user?.id}`);
        
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete dog');
        return false;
      }
    } catch (error) {
      console.error('Error deleting dog:', error);
      setError('Failed to delete dog');
      return false;
    }
  };

  // Get the first dog (for backwards compatibility)
  const primaryDog = dogs.length > 0 ? dogs[0] : null;

  return {
    dogs,
    primaryDog,
    isLoading,
    error,
    loadDogs,
    addDog,
    updateDog,
    deleteDog,
  };
};
