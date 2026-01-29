import { useState, useEffect } from 'react';

/**
 * Hook to calculate remaining time based on server offset.
 */
export const useTimer = (endTime, serverTimeOffset) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now() + serverTimeOffset;
      const difference = endTime - now;
      setTimeLeft(Math.max(0, difference));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [endTime, serverTimeOffset]);

  const formatTime = (ms) => {
    if (ms <= 0) return 'EXPIRED';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return { timeLeft, formattedTime: formatTime(timeLeft) };
};
