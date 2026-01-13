export default function SkeletonLoader() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-[#1e293b]">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-slate-200 dark:bg-[#334155]">
              <tr>
                {[...Array(9)].map((_, i) => (
                  <th key={i} className="px-3 py-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(9)].map((_, colIndex) => (
                    <td key={colIndex} className="px-3 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

