import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface CountdownTimerProps {
  totalSeconds: number;
  onComplete?: () => void;
}

export default function CountdownTimer({ totalSeconds, onComplete }: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 px-4 py-3 shadow-sm border border-blue-100 dark:border-slate-600">
      <div className="relative flex items-center justify-center">
        <svg className="h-10 w-10 -rotate-90 transform">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200 dark:text-slate-600"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
            className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <RefreshCw className="absolute h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Auto-refresh every 2 minutes
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            until next update
          </span>
        </div>
      </div>
    </div>
  );
}