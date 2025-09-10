import { link } from "fs";
import Link from "next/link";
import { Button } from "./ui/Button";
import { IconBrandGithub } from "@tabler/icons-react";

const navLinks = [
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Create",
    link: "/create",
  },
  {
    label: "Links",
    link: "/links",
  },
];

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 flex min-h-14 w-full max-w-screen min-w-sm items-center justify-between border-b-[0.25px] border-zinc-700 py-4 md:py-0 dark:border-zinc-600">
      <nav className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
        >
          Shortly
        </Link>
        <div className="flex items-center justify-center gap-8">
          {navLinks.map((navLink) => (
            <Link
              key={navLink.link}
              href={navLink.link}
              className="cursor-pointer text-sm underline-offset-3 hover:underline hover:opacity-60"
            >
              {navLink.label}
            </Link>
          ))}
        </div>
        <div
          className="flex items-center justify-center gap-2"
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
        </div>
      </nav>
    </header>
  );
};
