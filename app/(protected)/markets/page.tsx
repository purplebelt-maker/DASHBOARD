/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/dashboard/Footer";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useAppDispatch } from "@/redux/store";
import { getTodayEvents } from "@/redux/actions/eventsAction";
import EventsTable from "@/components/EventsTable";
import { useSelector } from "react-redux";
import { eventsSelector, authSelector } from "@/redux/reducers";
import { Clock, Zap, TrendingUp, RefreshCw } from "lucide-react";

export default function Home() {
  const dispatch = useAppDispatch();
  const { todayEvents, todayEventsLoading } = useSelector(eventsSelector);
  const { user: authUser } = useSelector(authSelector);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(getTodayEvents());

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(getTodayEvents());
    }, 300000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  if (!authUser) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <main className="space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-8 shadow-xl">
          {/* Decorative Background Elements */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-purple-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Content */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-white">
                    Live Updates
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                  Fresh Markets from the Last 24 Hours
                </h1>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                  Catch opportunities early! These prediction markets were just
                  added to Polymarket. Auto-refreshes every 5 minutes to show
                  you the newest trading opportunities.
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-100">Last 24 Hours</div>
                      <div className="text-sm font-bold text-white">
                        {todayEvents?.length || 0} Markets
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-100">Updated</div>
                      <div className="text-sm font-bold text-white">
                        {formatTime(currentTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-100">Status</div>
                      <div className="text-sm font-bold text-white">
                        All Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Refresh Button */}
              <div className="lg:text-right">
                <button
                  onClick={() => dispatch(getTodayEvents())}
                  disabled={todayEventsLoading}
                  className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${todayEventsLoading ? "animate-spin" : ""}`}
                  />
                  {todayEventsLoading ? "Refreshing..." : "Refresh Now"}
                </button>
                <p className="text-xs text-blue-100 mt-2">
                  Auto-refreshes every 5 min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Real-Time Market Feed
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This feed displays all prediction markets added to Polymarket in
                the past 24 hours. Markets are sorted with the newest first. The
                page automatically refreshes to keep you updated with the latest
                opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Events Table */}
        {todayEventsLoading ? (
          <div className="space-y-4">
            <SkeletonLoader />
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Loading fresh markets...
                </p>
              </div>
            </div>
          </div>
        ) : todayEvents?.length === 0 ? (
          <div className="flex items-center justify-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No New Markets Yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                No prediction markets have been added in the last 24 hours.
                Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <>
            <EventsTable
              data={todayEvents || []}
              loading={todayEventsLoading}
              page={1}
              totalPages={1}
              limit={20}
              onPageChange={() => {}}
              total={todayEvents?.length || 0}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
