"use client";
import React, { useState, useRef, useEffect } from "react";
import { UserType } from "@/types/user.type";
import { useUser } from "@/context/user";
import { useToast } from "./Toast";
import { handleLogout } from "@/lib/user.api";
import { errorHandler } from "@/utils/errorHandler";
import { Button } from "./Button";

type AvatarProps = {
  user: Pick<UserType, "fullName" | "email" | "id">;
};

export const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { setUser } = useUser();
  const { addToast } = useToast();

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const firstLetter =
    user.fullName && user.fullName.length > 0
      ? user.fullName[0].toUpperCase()
      : "?";

  const handleLogoutClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await handleLogout(user.id);
      setUser(null);
      addToast({
        id: Date.now(),
        message: "Logged out successfully.",
        type: "success",
      });
      setOpen(false);
    } catch (err: unknown) {
      addToast({
        id: Date.now(),
        message: errorHandler(err),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white transition select-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="User menu"
        type="button"
        tabIndex={0}
      >
        {firstLetter}
      </button>
      {open && (
        <div
          className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="px-4 py-3">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              {user.fullName}
            </div>
            <div className="truncate text-sm text-neutral-500 dark:text-neutral-300">
              {user.email}
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
          <Button
            className="w-full rounded-b-md px-4 py-2 text-left text-sm text-red-600 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
            variant="ghost"
            onClick={handleLogoutClick}
            type="button"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      )}
    </div>
  );
};
