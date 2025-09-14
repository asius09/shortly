"use client";
import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@/context/user";
import { useToast } from "./Toast";
import { handleLogout } from "@/lib/user.api";
import { errorHandler } from "@/utils/errorHandler";
import { Button } from "./Button";

// Tailwind color classes for avatar backgrounds and text
const AVATAR_BG_CLASSES = [
  "bg-orange-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-rose-500",
];
const AVATAR_TEXT_CLASS = "text-white";

// Pick a color class based on the user's name (stable for same name)
function getAvatarBgClass(name: string | undefined): string {
  if (!name) return AVATAR_BG_CLASSES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_BG_CLASSES.length;
  return AVATAR_BG_CLASSES[idx];
}

function getFirstLetter(fullName: string | undefined) {
  return fullName && fullName.length > 0 ? fullName[0].toUpperCase() : "?";
}

// LogoutButton: handles logout internally, no props needed
export const LogoutButton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const { user, setUser } = useUser();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (!user?.id) throw new Error("No user to log out");
      await handleLogout(user.id);
      setUser(null);
      addToast({
        id: Date.now(),
        message: "Logged out successfully.",
        type: "success",
      });
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
  if (!user) return;

  return (
    <Button
      className={`w-full rounded-t-none rounded-b-md px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20 dark:hover:text-red-400 ${className}`}
      variant="destructive"
      onClick={handleClick}
      type="button"
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

// Desktop avatar with dropdown, gets user from context
export const AvatarDesktop: React.FC = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  if (!user) return null;
  const firstLetter = getFirstLetter(user.fullName);
  const avatarBgClass = getAvatarBgClass(user.fullName);

  return (
    <div className="relative hidden md:inline-block" ref={popoverRef}>
      <button
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-200 text-lg font-bold transition select-none focus:ring-neutral-100 focus:outline-none ${avatarBgClass} ${AVATAR_TEXT_CLASS} shadow-sm`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="User menu"
        type="button"
        tabIndex={0}
      >
        {firstLetter}
      </button>
      {open && (
        <>
          {/* Mobile Overlay (hidden on md+) */}
          <div
            className="fixed inset-0 z-10 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
            <div className="px-4 py-3">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                {user.fullName}
              </div>
              <div className="truncate text-xs text-neutral-500 dark:text-neutral-300">
                {user.email}
              </div>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-700" />
            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
};

// Mobile avatar row, gets user from context
export const AvatarMobile: React.FC = () => {
  const { user } = useUser();
  if (!user) return null;
  const firstLetter = getFirstLetter(user.fullName);
  const avatarBgClass = getAvatarBgClass(user.fullName);

  return (
    <div className="flex w-full items-center gap-3 px-2 py-3 sm:hidden">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-lg font-bold shadow-sm ${avatarBgClass} ${AVATAR_TEXT_CLASS}`}
        >
          {firstLetter}
        </span>
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {user.fullName}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-300">
            {user.email}
          </span>
        </div>
      </div>
    </div>
  );
};

// Responsive avatar: handles all logic internally, no props
export const Avatar: React.FC = () => {
  return (
    <>
      <span className="hidden align-middle md:inline-block">
        <AvatarDesktop />
      </span>
      <span className="block w-full md:hidden">
        <AvatarMobile />
      </span>
    </>
  );
};
