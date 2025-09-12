"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";

export interface Toast {
  id: number | string;
  message: string;
  type?: "success" | "error" | "info";
}

interface AddToastArgs {
  id: number | string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextProps {
  addToast: (toast: AddToastArgs) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};

interface ToastProviderProps {
  children: ReactNode;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

function formatErrorMessage(message: string | undefined): string {
  if (!message || typeof message !== "string" || message.trim() === "") {
    return DEFAULT_ERROR_MESSAGE;
  }
  // Remove technical prefixes, trim, and capitalize first letter
  let msg = message.replace(/^Error:\s*/i, "").trim();
  msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  // Optionally, limit length for small toasts
  if (msg.length > 120) {
    msg = msg.slice(0, 117) + "...";
  }
  return msg;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = ({ message, id, type }: AddToastArgs) => {
    setToasts((prev) => [...prev, { message, id, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const getIcon = (type?: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return (
          <IconCheck className="h-4 w-4 text-green-600 dark:text-green-200" />
        );
      case "error":
        return <IconX className="h-4 w-4 text-red-600 dark:text-red-200" />;
      case "info":
      default:
        return (
          <IconInfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-200" />
        );
    }
  };

  const getBgClass = (type?: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-900 dark:bg-green-700 dark:text-green-50";
      case "error":
        return "bg-red-100 text-red-900 dark:bg-red-700 dark:text-red-50";
      case "info":
      default:
        return "bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-blue-50";
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex max-w-xs min-w-[220px] items-center gap-2 rounded px-3 py-2 shadow-lg transition-colors ${getBgClass(toast.type)}`}
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium break-words">
              {toast.type === "error"
                ? formatErrorMessage(toast.message)
                : formatErrorMessage(toast.message)}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
