interface ProbabilityBarProps {
  yes: number
  no: number
}

export default function ProbabilityBar({ yes, no }: ProbabilityBarProps) {
  const yesPercent = Math.round(yes)
  const noPercent = Math.round(no)
  const total = yesPercent + noPercent
  const yesWidth = total > 0 ? (yesPercent / total) * 100 : 0
  const noWidth = total > 0 ? (noPercent / total) * 100 : 0

  return (
    <div className="flex flex-col space-y-1">
      <div className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-300">
        Yes: {yesPercent}% | No: {noPercent}%
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 transition-colors duration-300">
        <div
          className="bg-blue-500 transition-all duration-300"
          style={{ width: `${yesWidth}%` }}
        />
        <div
          className="bg-gray-400 dark:bg-gray-600 transition-all duration-300"
          style={{ width: `${noWidth}%` }}
        />
      </div>
    </div>
  )
}

