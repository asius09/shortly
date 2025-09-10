"use client";
import { cn } from "@/utils/cn";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subTitle?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, title, subTitle, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "h-fit w-fit max-w-lg min-w-md rounded-2xl border p-5",
        "border-neutral-200 bg-neutral-100 shadow-lg shadow-neutral-200/60",
        "dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-2xl dark:shadow-white/4",
        "flex flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      {title && (
        <h2 className="mb-1 block text-center text-2xl leading-tight font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>
      )}
      {subTitle && (
        <p className="mb-6 block text-center text-base font-medium text-neutral-700 dark:text-neutral-300">
          {subTitle}
        </p>
      )}
      {children}
    </div>
  ),
);

Card.displayName = "Card";
