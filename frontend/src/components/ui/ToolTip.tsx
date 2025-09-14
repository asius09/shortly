"use client";
import React, { useState, useRef, useEffect } from "react";

interface ToolTipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number; // ms before showing tooltip
}

export const ToolTip: React.FC<ToolTipProps> = ({
  content,
  children,
  side = "top",
  className = "",
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  // Positioning classes
  const sideClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // For group-hover: always render tooltip, but control opacity/visibility with group-hover
  // Also keep support for delay and manual show/hide for keyboard users
  const showTooltip = () => {
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
  };

  return (
    <span
      className="group relative inline-block focus:outline-none"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      tabIndex={0}
      aria-describedby="tooltip"
      style={{ outline: "none" }}
    >
      {children}
      <div
        ref={tooltipRef}
        id="tooltip"
        role="tooltip"
        // group-hover:opacity-100 makes tooltip visible on hover of parent
        // opacity-0 pointer-events-none hides it otherwise, unless visible (for keyboard)
        className={`absolute z-50 min-w-max rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white shadow-lg transition-opacity duration-150 dark:bg-neutral-800 ${sideClasses[side]} ${className} pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 ${visible ? "pointer-events-auto opacity-100" : ""} `}
        style={
          {
            // If visible (keyboard focus or delayed mouse), show tooltip
            // Otherwise, rely on group-hover for mouse hover
            // This ensures both keyboard and mouse users get the tooltip
          }
        }
      >
        {content}
      </div>
    </span>
  );
};
