import { PoopLog } from '@/hooks/usePoopLogs';

export const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(),
    dayOfWeek: date.toLocaleDateString([], { weekday: 'long' }),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    relative: getRelativeTime(date)
  };
};

export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const getLogsForDate = (date: Date, poopLogs: PoopLog[]) => {
  const dateString = date.toDateString();
  return poopLogs.filter(log => {
    const logDate = new Date(log.created_at);
    return logDate.toDateString() === dateString;
  });
};

export const getDatesWithLogs = (poopLogs: PoopLog[]) => {
  const dates = new Set<string>();
  poopLogs.forEach(log => {
    const logDate = new Date(log.created_at);
    dates.add(logDate.toDateString());
  });
  return Array.from(dates).map(dateString => new Date(dateString));
};

export const dateHasLogs = (date: Date, poopLogs: PoopLog[]) => {
  const dateString = date.toDateString();
  return poopLogs.some(log => {
    const logDate = new Date(log.created_at);
    return logDate.toDateString() === dateString;
  });
};

export const getPoopsThisMonth = (poopLogs: PoopLog[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return poopLogs.filter(log => {
    const logDate = new Date(log.created_at);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  }).length;
};
