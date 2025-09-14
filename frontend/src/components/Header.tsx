"use client";
import Link from "next/link";
import { IconBrandGithub, IconMenu2, IconX } from "@tabler/icons-react";
import { Button } from "./ui/Button";
import { useUser } from "@/context/user";
import { Avatar, AvatarDesktop, AvatarMobile, LogoutButton } from "./ui/Avatar";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavLinks = navLinks.filter((navLink) => {
    // Show "Shorten" and "Links" only if user is present, "About" always
    if (navLink.auth) {
      return !!user;
    }
    return true;
  });

  return (
    <>
      <header className="fixed top-0 left-0 z-50 flex min-h-14 w-full items-center border-b-[0.25px] border-zinc-700 bg-neutral-100/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8 dark:border-zinc-600 dark:bg-neutral-950/80">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between">
          {/* Left: Logo */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
            >
              Shortly
            </Link>
          </div>

          {/* Center: Nav Links - Hidden on mobile, shown on tablet+ */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-8">
              {filteredNavLinks.map((navLink) => (
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
              <AvatarDesktop />
            ) : (
              <span className="hidden items-center justify-center gap-2 md:flex">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="hidden w-20 px-3 py-1 text-sm font-medium sm:block"
                    type="button"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="hidden w-20 px-3 py-1 text-sm font-medium sm:block"
                    type="button"
                  >
                    Sign Up
                  </Button>
                </Link>
                {/* Mobile auth buttons */}
                <div className="flex items-center gap-1 sm:hidden">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-16 px-2 py-1 text-xs font-medium"
                      type="button"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      className="w-16 px-2 py-1 text-xs font-medium"
                      type="button"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </span>
            )}

            {/* Mobile Menu Button */}
            <button
              className="ml-2 flex size-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 hover:bg-neutral-200 md:hidden dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              type="button"
            >
              {mobileMenuOpen ? <IconX size={16} /> : <IconMenu2 size={16} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/20"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-14 right-0 left-0 border-b border-neutral-200 bg-neutral-100 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-3 px-4 py-4">
              <AvatarMobile />
              {filteredNavLinks.map((navLink) => (
                <Link
                  key={navLink.link}
                  href={navLink.link}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navLink.label}
                </Link>
              ))}
              <LogoutButton />
              {/* Show auth buttons for smaller devices only (when not logged in) */}
              {!user && (
                <div className="flex w-full flex-col gap-2 md:hidden">
                  <Link href="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full px-2 py-2 text-xs font-medium"
                      type="button"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      className="w-full px-2 py-2 text-xs font-medium"
                      type="button"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
