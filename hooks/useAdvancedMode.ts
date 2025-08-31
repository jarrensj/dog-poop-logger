import { useState, useEffect } from 'react';

export const useAdvancedMode = (selectedDate?: Date) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  // Set default date and time when advanced mode is enabled
  useEffect(() => {
    if (isAdvancedMode && !customDate && !customTime) {
      const now = new Date();
      const dateToUse = selectedDate || now;
      
      const year = dateToUse.getFullYear();
      const month = String(dateToUse.getMonth() + 1).padStart(2, '0');
      const day = String(dateToUse.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      
      setCustomDate(dateString);
      setCustomTime(currentTime);
    }
  }, [isAdvancedMode, customDate, customTime, selectedDate]);

  // Update custom date when selected date changes
  useEffect(() => {
    if (isAdvancedMode && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setCustomDate(dateString);
    }
  }, [selectedDate, isAdvancedMode]);

  const getCustomDateTime = () => {
    if (isAdvancedMode && customDate && customTime) {
      const customDateTime = new Date(`${customDate}T${customTime}`);
      return customDateTime.toISOString();
    }
    return undefined;
  };

  const resetAdvancedMode = () => {
    setCustomDate('');
    setCustomTime('');
    setIsAdvancedMode(false);
  };

  const isValid = !isAdvancedMode || (customDate && customTime);

  return {
    isAdvancedMode,
    setIsAdvancedMode,
    customDate,
    setCustomDate,
    customTime,
    setCustomTime,
    getCustomDateTime,
    resetAdvancedMode,
    isValid,
  };
};
