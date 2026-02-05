"use client";

import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AlertSelector } from "@/redux/reducers";
import { AuthErrors } from "@/lib/utils/ErrorHandler";
import { IAlert } from "@/types/alert";
import { removeAlert } from "@/redux/reducers/alertReducer";

const ignoreAlerts = [AuthErrors.LoginNeeded];

export interface IAlertProps {
  duration?: number;
  placement?:
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left";
}

const Alert: React.FC<IAlertProps> = (props: IAlertProps) => {
  const AlertState = useSelector(AlertSelector);
  const dispatch = useDispatch();
  const { placement = "top-right", duration = 4 } = props;

  const alertConfig = {
    success: {
      icon: <CheckCircle2 size={20} />,
      iconColor: "text-emerald-500",
      bgColor: "bg-white dark:bg-gray-900",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      textColor: "text-gray-900 dark:text-gray-100",
      accentColor: "bg-emerald-500",
    },
    info: {
      icon: <Info size={20} />,
      iconColor: "text-blue-500",
      bgColor: "bg-white dark:bg-gray-900",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-gray-900 dark:text-gray-100",
      accentColor: "bg-blue-500",
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      iconColor: "text-amber-500",
      bgColor: "bg-white dark:bg-gray-900",
      borderColor: "border-amber-200 dark:border-amber-800",
      textColor: "text-gray-900 dark:text-gray-100",
      accentColor: "bg-amber-500",
    },
    danger: {
      icon: <XCircle size={20} />,
      iconColor: "text-rose-500",
      bgColor: "bg-white dark:bg-gray-900",
      borderColor: "border-rose-200 dark:border-rose-800",
      textColor: "text-gray-900 dark:text-gray-100",
      accentColor: "bg-rose-500",
    },
    loading: {
      icon: <Loader2 size={20} className="animate-spin" />,
      iconColor: "text-gray-500",
      bgColor: "bg-white dark:bg-gray-900",
      borderColor: "border-gray-200 dark:border-gray-800",
      textColor: "text-gray-900 dark:text-gray-100",
      accentColor: "bg-gray-500",
    },
  };

  useEffect(() => {
    if (AlertState && AlertState.length > 0) {
      AlertState.filter((alert: IAlert) => {
        return ignoreAlerts.indexOf(alert.message as AuthErrors) === -1;
      }).forEach((alert: IAlert) => {
        const config =
          alertConfig[alert.type as keyof typeof alertConfig] ||
          alertConfig.info;

        toast.custom(
          (t) => (
            <div
              className={`
                ${t.visible ? "animate-in slide-in-from-right-2" : "animate-out slide-out-to-right-2"}
                w-full max-w-sm pointer-events-auto
                transition-all duration-200
                ${alert.url ? "cursor-pointer hover:scale-[1.02]" : ""}
              `}
              onClick={() => {
                if (alert.url) {
                  window.open(alert.url, "_blank");
                  toast.dismiss(t.id);
                }
              }}
            >
              {/* Main container */}
              <div
                className={`
                  relative
                  ${config.bgColor}
                  border ${config.borderColor}
                  rounded-lg
                  shadow-lg
                  p-4
                  flex items-start gap-3
                  backdrop-blur-sm
                  transition-transform duration-200
                `}
              >
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-lg">
                  <div
                    className={`
                      h-full ${config.accentColor}
                      transition-all duration-${duration * 1000} ease-linear
                      ${t.visible ? "animate-progress" : ""}
                    `}
                    style={{
                      animationDuration: `${duration}s`,
                    }}
                  />
                </div>

                {/* Icon container */}
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${config.textColor} leading-relaxed break-words`}
                  >
                    {alert.message}
                  </p>

                  {/* View Details Button - Only shown if URL exists */}
                  {alert.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(alert.url, "_blank");
                        toast.dismiss(t.id);
                      }}
                      className={`
                        mt-2
                        inline-flex items-center gap-1.5
                        text-xs font-medium ${config.iconColor}
                        hover:opacity-80
                        px-2 py-1
                        rounded-md
                        transition-all duration-200
                        bg-opacity-10 ${config.iconColor.replace("text-", "bg-")}
                      `}
                    >
                      View Details
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                    dispatch(removeAlert(alert.id as any));
                  }}
                  className={`
                    flex-shrink-0
                    text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    rounded-md p-1
                    transition-all duration-200
                  `}
                  aria-label="Close notification"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ),
          {
            duration: duration * 1000,
            position: placement as any,
            id: alert.id as string,
          },
        );

        setTimeout(
          () => {
            dispatch(removeAlert(alert.id as any));
          },
          duration * 1000 + 500,
        );
      });
    }
  }, [AlertState, dispatch, duration, placement]);

  // Custom Toaster configuration
  return (
    <Toaster
      position={placement as any}
      gutter={8}
      toastOptions={{
        className: "!bg-transparent !shadow-none !p-0",
      }}
    />
  );
};

export default Alert;
