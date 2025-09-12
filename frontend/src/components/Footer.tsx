import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 w-full bg-neutral-50 py-4 text-center text-xs text-neutral-400 dark:bg-neutral-950">
      <span className="opacity-70">
        Built by{" "}
        <Link
          href="https://asius.in"
          className="font-semibold text-neutral-500 underline transition-colors hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-50"
          target="_blank"
          rel="noopener noreferrer"
        >
          asius.in
        </Link>
      </span>
    </footer>
  );
}
