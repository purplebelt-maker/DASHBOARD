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
// import ProbabilityBar from "./ProbabilityBar";
import { IEvent } from "@/types/events/state";
import ProbabilityBar from "./ProbabilityBar";

interface EventsTableProps {
  data: IEvent[];
  loading: boolean;
}

export default function EventsTable({ data, loading }: EventsTableProps) {
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
      accessorKey: "volumeTotal",
      header: "Volume (Total)",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => (
        <div className="flex flex-col">
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
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-slate-200 dark:bg-[#334155]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
