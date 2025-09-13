"use client";
import Link from "next/link";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "./ui/Button";
import { useUser } from "@/context/user";
import { Avatar } from "./ui/Avatar";

const navLinks = [
  {
    label: "Shorten",
    link: "/",
    auth: true,
  },
  {
    label: "Links",
    link: "/links",
    auth: true,
  },
  {
    label: "About",
    link: "/about",
    auth: false,
  },
];

export const Header = () => {
  const { user } = useUser();
  return (
    <header className="fixed top-0 left-0 flex min-h-14 w-full max-w-screen min-w-sm items-center border-b-[0.25px] border-zinc-700 py-4 md:py-0 dark:border-zinc-600">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
          >
            Shortly
          </Link>
        </div>
        {/* Center: Nav Links */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-8">
            {navLinks
              .filter((navLink) => {
                // Show "Shorten" and "Links" only if user is present, "About" always
                if (navLink.auth) {
                  return !!user;
                }
                return true;
              })
              .map((navLink) => (
                <Link
                  key={navLink.link}
                  href={navLink.link}
                  className="cursor-pointer text-sm underline-offset-3 hover:underline hover:opacity-60"
                >
                  {navLink.label}
                </Link>
              ))}
          </div>
        </div>
        {/* Right: Icons and Auth */}
        <div
          className="flex flex-1 items-center justify-end gap-2"
          id="links-icons"
        >
          <Link
            href="https://github.com/asius09/shortly"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 p-0 hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <IconBrandGithub size={16} />
          </Link>
          {user ? (
            <Avatar user={user} />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-20 px-3 py-1 text-sm font-medium"
                  type="button"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="w-20 px-3 py-1 text-sm font-medium"
                  type="button"
                >
                  Sign Up
                </Button>
              </Link>
            </span>
          )}
        </div>
      </nav>
    </header>
  );
};
