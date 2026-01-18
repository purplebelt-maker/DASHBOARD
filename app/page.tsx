/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/dashboard/Header";
import ControlBar from "@/components/dashboard/ControlBar";
import MarketsGrid from "@/components/dashboard/MarketsGrid";
import Footer from "@/components/dashboard/Footer";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import PrivacyModal from "@/components/dashboard/PrivacyModal";
import RefreshNotification from "@/components/dashboard/RefreshNotification";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { Market } from "@/types";
import CountdownTimer from "@/components/CountdownTimer";
import { useAppDispatch } from "@/redux/store";
import { getEvents } from "@/redux/actions/eventsAction";
import EventsTable from "@/components/EventsTable";
import { useSelector } from "react-redux";
import { eventsSelector } from "@/redux/reducers";
import { EndingIn, EventCategory, SortBy } from "@/types/events/filters";
import { eventToMarket } from "@/lib/mappers/eventToMarket";
import EventsGrid from "@/components/EventsGrid";

const REFRESH_INTERVAL_MS = 120000; // Changed from 20000 to 120000 (2 minutes)

export type SortOrder = "asc" | "desc";

export default function Home() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);

  const [volumeSortOrder, setVolumeSortOrder] = useState<SortOrder>("desc");
  const [countdownKey, setCountdownKey] = useState(0);

  const fetchMarkets = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) {
          setLoading(true);
        }
        setError(null);

        const cacheBuster = isRefresh
          ? `?_t=${Date.now()}`
          : `?_t=${Date.now()}`;
        const params = new URLSearchParams({
          order: volumeSortOrder,
          _t: Date.now().toString(),
        });

        const response = await fetch(`/api/markets?${params.toString()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch markets: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.message || data.error);
        }

        console.log("markets data is ", markets);

        setMarkets(data.markets || []);
        setLastRefreshTime(new Date());
        setCountdownKey((prev) => prev + 1); // Reset countdown

        if (isRefresh) {
          setShowRefreshNotification(true);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch markets",
        );
        if (!isRefresh) {
          setLoading(false);
        }
      } finally {
        if (!isRefresh) {
          setLoading(false);
        }
      }
    },
    [volumeSortOrder],
  );

  useEffect(() => {
    fetchMarkets(false);
    const interval = setInterval(() => fetchMarkets(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const dispatch = useAppDispatch();

  const { data: eventData, loading: eventLoading } =
    useSelector(eventsSelector);

  // filters
  // EVENTS pagination
  const [eventPage, setEventPage] = useState(1);

  const [eventLimit, setEventLimit] = useState(20);

  // EVENTS filters (match backend)
  const [eventFilters, setEventFilters] = useState<{
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    categoryId?: EventCategory[];
    endingIn?: EndingIn;
  }>({
    sortBy: "volume24hr",
    sortOrder: "desc",
  });

  const [filtersLoading, setFiltersLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setFiltersLoading(true);
      await dispatch(
        getEvents({
          page: eventPage,
          limit: eventLimit,
          ...eventFilters,
        }),
      );
      setFiltersLoading(false);
    })();
  }, [eventPage, eventFilters, eventLimit]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <PrivacyModal />
      <ThemeToggle />
      <RefreshNotification
        show={showRefreshNotification}
        onComplete={() => setShowRefreshNotification(false)}
      />
      <Header />

      <ControlBar
        view={view}
        onViewChange={setView}
        lastRefreshTime={lastRefreshTime}
      />

      {/* <div className="container mx-auto px-4 pt-4">
        <CountdownTimer
          key={countdownKey}
          totalSeconds={120}
          onComplete={() => {}}
        />
      </div> */}

      {/* EVENTS FILTER BAR - IMPROVED DESIGN */}
      <div className="container mx-auto mt-6">
        <div className="rounded-2xl border border-gray-200/80 dark:border-slate-700/70 bg-gradient-to-br from-white/50 to-gray-50/30 dark:from-slate-900/40 dark:to-slate-800/30 backdrop-blur-sm p-6 shadow-lg shadow-gray-100/50 dark:shadow-slate-900/20">
          {/* Section Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Events Filter
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Refine and sort event predictions
              </p>
            </div>
          </div>

          {/* Main Filters Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* Sort By */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Sort by
              </label>
              <div className="relative">
                <select
                  value={eventFilters.sortBy}
                  onChange={(e) =>
                    setEventFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as SortBy,
                    }))
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300/80 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="volume24hr">Volume (24h)</option>
                  <option value="volumeTotal">Volume (Total)</option>
                  <option value="liquidity">Liquidity</option>
                  <option value="volume1wk">Volume (1 week)</option>
                  <option value="volume1mo">Volume (1 month)</option>
                  <option value="volume1yr">Volume (1 year)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ending In */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Ending in
              </label>
              <div className="relative">
                <select
                  value={eventFilters.endingIn || ""}
                  onChange={(e) =>
                    setEventFilters((prev) => ({
                      ...prev,
                      endingIn: e.target.value
                        ? (e.target.value as EndingIn)
                        : undefined,
                    }))
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300/80 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="">Any time</option>
                  <option value="7d">7 days</option>
                  <option value="14d">14 days</option>
                  <option value="1mo">1 month</option>
                  <option value="3mo">3 months</option>
                  <option value="6mo">6 months</option>
                  <option value="1yr">1 year</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rows per page */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Rows per page
              </label>
              <div className="relative">
                <select
                  value={eventLimit}
                  onChange={(e) => setEventLimit(Number(e.target.value))}
                  className="w-full appearance-none rounded-xl border border-gray-300/80 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white shadow-sm hover:border-gray-400 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <div className="lg:col-span-2 flex items-end">
              <button
                onClick={() => {
                  setEventFilters({
                    sortBy: "volume24hr",
                    sortOrder: "desc",
                  });
                  setEventLimit(20);
                  setEventPage(1);
                }}
                className="w-full rounded-xl border border-gray-300/80 dark:border-slate-600 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset All
                </div>
              </button>
            </div>
          </div>

          {/* CATEGORY CHIPS - IMPROVED */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EventCategory).map(([label, value]) =>
                typeof value === "number" ? (
                  <button
                    key={value}
                    onClick={() =>
                      setEventFilters((prev) => {
                        const current = prev.categoryId || [];
                        const exists = current.includes(value);

                        return {
                          ...prev,
                          categoryId: exists
                            ? current.filter((id) => id !== value)
                            : [...current, value],
                        };
                      })
                    }
                    className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      eventFilters.categoryId?.includes(value)
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/25"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:shadow-md"
                    }`}
                  >
                    {eventFilters.categoryId?.includes(value) && (
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                    )}
                    {label}
                    {eventFilters.categoryId?.includes(value) && (
                      <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                ) : null,
              )}
            </div>
          </div>

          {/* Active Filters Badge */}
          {(eventFilters.categoryId?.length || 0) > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-blue-50/50 dark:bg-blue-900/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {eventFilters.categoryId?.length || 0} categories selected
                </span>
              </div>
              <button
                onClick={() =>
                  setEventFilters((prev) => ({
                    ...prev,
                    categoryId: [],
                  }))
                }
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Clear categories
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        {eventLoading || filtersLoading ? (
          <div className="space-y-4">
            <SkeletonLoader />
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Loading markets...
                </p>
              </div>
            </div>
          </div>
        ) : error && markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Failed to load markets
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
              <button
                onClick={() => fetchMarkets(false)}
                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        ) : markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No markets found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                There are currently no active markets available.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* {view === "table" && <MarketsTable markets={markets} />} */}
            {view === "table" && (
              <EventsTable
                data={eventData?.results || []}
                loading={eventLoading}
                page={eventData?.page || eventPage}
                totalPages={eventData?.totalPages || 1}
                total={eventData?.total || 0}
                limit={eventData?.limit || eventLimit}
                onPageChange={setEventPage}
              />
            )}

            {/* 
        HERE I'M CONVERTING EVENTS DATA TO MARKET BECAUSE THE PREVIOUS DEVELOPER CREATED THE UI WITH MARKETS DATA
        NOW WE'RE USING THE EVENTS API, AND IT'S RESPONSE IS A LITTLE DIFFERNT THAN THE MARKETS API,
        THAT'S WHY INSTEAD OF CHANGE ALL THE UI , I DECIDED TO JUST MAP THE TYPES
*/}
            {view === "grid" && (
              <EventsGrid
                data={eventData?.results || []}
                loading={eventLoading}
                page={eventData?.page || eventPage}
                totalPages={eventData?.totalPages || 1}
                total={eventData?.total || 0}
                limit={eventData?.limit || eventLimit}
                onPageChange={setEventPage}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
