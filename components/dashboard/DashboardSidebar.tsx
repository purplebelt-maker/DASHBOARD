// components/dashboard/DashboardSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Bell, 
  Settings, 
  BarChart3,
  TrendingUp,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

interface DashboardSidebarProps {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export default function DashboardSidebar({ 
  mobileMenuOpen = false, 
  setMobileMenuOpen,
  sidebarCollapsed,
  setSidebarCollapsed
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Latest Markets",
      href: "/markets",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
        sidebarCollapsed ? "lg:w-20" : "lg:w-64"
      }`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 px-6 pb-4">
          {/* Logo + Toggle */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!sidebarCollapsed && (
              <Image
                src="/updated-logo.png"
                alt="Prediction Market Edge"
                width={140}
                height={45}
                className="h-8 w-auto"
              />
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ml-auto"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className={`group w-full flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-105"
                      } ${sidebarCollapsed ? "justify-center" : ""}`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Upgrade Card */}
            {!sidebarCollapsed && (
              <div className="mt-auto pt-4">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-5 shadow-xl">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Upgrade to Pro
                    </h3>
                    <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                      Get instant alerts and unlock advanced features
                    </p>
                    <button
                      onClick={() => handleNavigation("/pricing")}
                      className="w-full bg-white hover:bg-blue-50 text-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-105 shadow-lg"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsed Upgrade Button */}
            {sidebarCollapsed && (
              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleNavigation("/pricing")}
                  className="w-full flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl hover:scale-105 transition-all shadow-lg"
                  title="Upgrade to Pro"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen?.(false)}
        />

        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300">
          <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700">
              <Image
                src="/updated-logo.png"
                alt="Prediction Market Edge"
                width={120}
                height={38}
                className="h-7 w-auto"
              />
              <button
                onClick={() => setMobileMenuOpen?.(false)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`group w-full flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"}>
                          {item.icon}
                        </span>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isActive && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-5 shadow-xl">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Upgrade to Pro
                    </h3>
                    <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                      Get instant alerts and unlock advanced features
                    </p>
                    <button
                      onClick={() => handleNavigation("/pricing")}
                      className="w-full bg-white hover:bg-blue-50 text-blue-600 rounded-xl px-4 py-2.5 text-sm font-bold transition-all shadow-lg"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}