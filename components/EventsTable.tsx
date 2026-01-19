"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getYesNoProbability } from "@/lib/utils/probability";
import { formatEndsIn } from "@/lib/utils/endsIn";
import { IEvent } from "@/types/events/state";
import ProbabilityBar from "./ProbabilityBar";

import { EventCategory, EventCategorySlug } from "@/types/events/filters";

const KNOWN_CATEGORY_IDS = new Set<number>(
  Object.values(EventCategory).filter((v) => typeof v === "number") as number[],
);

function getEventCategories(tagIds: number[]): EventCategory[] {
  return tagIds.filter((id) => KNOWN_CATEGORY_IDS.has(id)) as EventCategory[];
}

interface EventsTableProps {
  data: IEvent[];
  loading: boolean;

  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function EventsTable({
  data,
  loading,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: EventsTableProps) {
  console.log("EVENT DATA LOOKS LIKE THIS", data);
  const columns: ColumnDef<IEvent>[] = [
    {
      accessorKey: "title",
      header: "Event",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {row.original.title}
        </div>
      ),
    },
    {
      header: "Category",
      cell: ({ row }) => {
        const categories = getEventCategories(row.original.tagIds);

        if (!categories.length) {
          return (
            <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-slate-300 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                {EventCategorySlug[cat]}
              </span>
            ))}
          </div>
        );
      },
    },

    {
      header: "Probability",
      cell: ({ row }) => {
        const prob = getYesNoProbability(row.original.markets);
        return <ProbabilityBar yes={prob?.yes ?? null} no={prob?.no ?? null} />;
      },
    },
    {
      accessorKey: "liquidity",
      header: "Liquidity",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: "volume24hr",
      header: "Volume (24h)",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: "volume1wk",
      header: "Volume (week)",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    // {
    //   accessorKey: "volume1mo",
    //   header: "Volume (month)",
    //   cell: ({ getValue }) => formatCurrency(getValue<number>()),
    // },
    // {
    //   accessorKey: "volume1yr",
    //   header: "Volume (year)",
    //   cell: ({ getValue }) => formatCurrency(getValue<number>()),
    // },
    {
      accessorKey: "volumeTotal",
      header: "Volume (Total)",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[200px]">
          <span className="text-sm font-medium">
            {formatDate(row.original.endDate)}
          </span>
          <span className="text-xs text-amber-500 font-medium">
            {formatEndsIn(row.original.endDate)}
          </span>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-100 dark:bg-[#1e293b] shadow-md transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-slate-200 dark:bg-[#334155]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-3 text-left text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading events…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-600 dark:text-gray-400"
                >
                  No events found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-200 dark:hover:bg-[#334155] transition-colors cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://polymarket.com/event/${row.original.slug}`,
                      "_blank",
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-700 bg-slate-200 dark:bg-[#334155] px-4 py-3">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
          {total}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
