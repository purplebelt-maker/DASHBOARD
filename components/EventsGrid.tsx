// components/events/EventsGrid.tsx
"use client";

import { memo } from "react";
import { IEvent } from "@/types/events/state";
import EventCard from "./EventCard";

interface EventsGridProps {
  data: IEvent[];
  loading: boolean;

  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

function EventsGrid({
  data,
  loading,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: EventsGridProps) {
  return (
    <div>
      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading events…</div>
      ) : data.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No events found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-slate-200 dark:bg-[#334155] px-4 py-3">
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

export default memo(EventsGrid);
