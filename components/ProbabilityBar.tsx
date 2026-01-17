// components/ProbabilityBar.tsx
"use client";

interface ProbabilityBarProps {
  yes: number | null;
  no: number | null;
}

export default function ProbabilityBar({ yes, no }: ProbabilityBarProps) {
  if (yes === null || no === null) {
    return <span className="text-gray-500">—</span>;
  }

  const yesPct = Math.round(yes * 100);
  const noPct = Math.round(no * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-green-600 dark:text-green-400">
          YES {yesPct}%
        </span>
        <span className="text-red-600 dark:text-red-400">NO {noPct}%</span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded bg-gray-300 dark:bg-gray-700">
        <div
          className="absolute left-0 top-0 h-full bg-green-600 dark:bg-green-500 transition-all"
          style={{ width: `${yesPct}%` }}
        />
      </div>
    </div>
  );
}
