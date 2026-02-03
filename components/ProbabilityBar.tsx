"use client";

interface ProbabilityBarProps {
  outcomes: {
    outcome1: { name: string; probability: number };
    outcome2: { name: string; probability: number };
  } | null;
}

export default function ProbabilityBar({ outcomes }: ProbabilityBarProps) {
  if (!outcomes) {
    return <span className="text-gray-500">—</span>;
  }

  const { outcome1, outcome2 } = outcomes;

  // Clamp probabilities
  const safeProb1 = Math.min(Math.max(outcome1.probability, 0), 1);
  const prob1Pct = Math.round(safeProb1 * 100);
  const prob2Pct = 100 - prob1Pct; // Guaranteed total = 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span className="text-green-600 dark:text-green-400">
          {outcome1.name} {prob1Pct}%
        </span>
        <span className="text-red-600 dark:text-red-400">
          {outcome2.name} {prob2Pct}%
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded bg-gray-300 dark:bg-gray-700">
        <div
          className="absolute left-0 top-0 h-full bg-green-600 dark:bg-green-500 transition-all"
          style={{ width: `${prob1Pct}%` }}
        />
      </div>
    </div>
  );
}
