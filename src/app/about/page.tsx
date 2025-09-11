import { Card } from "@/components/ui/Card";
import {
  IconLink,
  IconDatabase,
  IconServer,
  IconUser,
  IconBrandGithub,
  IconBrandNextjs,
  IconBrandMongodb,
  IconBrandTailwind,
  IconBrandTypescript,
  IconCode,
} from "@tabler/icons-react";
import Link from "next/link";
import { ExpressIcon } from "@/components/Icons";

const stackData = [
  {
    icon: <IconBrandNextjs size={16} className="inline" />,
    label: "Next.js",
    className:
      "text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800",
  },
  {
    icon: <IconBrandMongodb size={16} className="inline" />,
    label: "MongoDB",
    className:
      "text-green-700 dark:text-green-400 bg-neutral-100 dark:bg-neutral-800",
  },
  {
    icon: <IconBrandTailwind size={16} className="inline" />,
    label: "Tailwind CSS",
    className:
      "text-sky-700 dark:text-sky-300 bg-neutral-100 dark:bg-neutral-800",
  },
  {
    icon: <IconBrandTypescript size={16} className="inline" />,
    label: "TypeScript",
    className:
      "text-blue-700 dark:text-blue-400 bg-neutral-100 dark:bg-neutral-800",
  },
  {
    icon: <ExpressIcon width={16} height={16} className="inline" />,
    label: "Express.js",
    className:
      "text-gray-700 dark:text-gray-300 bg-neutral-100 dark:bg-neutral-800",
  },
];

const featuresData = [
  {
    icon: <IconDatabase size={20} />,
    main: "MongoDB",
    desc: "NoSQL database for storage",
  },
  {
    icon: <IconServer size={20} />,
    main: "Next.js API Routes & Express.js",
    desc: "Backend server and APIs",
  },
  {
    icon: <IconLink size={20} />,
    main: "Tailwind CSS",
    desc: "Modern UI styling",
  },
  {
    icon: <IconBrandTypescript size={20} />,
    main: "TypeScript",
    desc: "Type-safe development",
  },
];

export default function AboutPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <IconLink
              size={32}
              className="text-neutral-700 dark:text-neutral-200"
            />
            <span className="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
              About Shortly
            </span>
          </div>
          <p className="max-w-md text-center text-sm text-neutral-700 dark:text-neutral-200">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Shortly
            </span>{" "}
            is a simple URL shortener app focused on backend and database
            practice. Create, share, and manage short links with a clean,
            minimal interface.
          </p>
          <div className="flex w-full flex-col items-center gap-2">
            <div className="mt-2 mb-1 flex flex-wrap items-center justify-center gap-3">
              {stackData.map((item) => (
                <span
                  key={item.label}
                  className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${item.className}`}
                >
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>
            <ul className="flex w-full flex-col gap-3 text-base text-neutral-700 dark:text-neutral-200">
              {featuresData.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  {item.icon}
                  <span>
                    <span className="font-semibold">{item.main}</span>{" "}
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            {/*
              Refactored: Use an array to define the links and map over it for rendering.
            */}
            {(() => {
              const aboutLinks = [
                {
                  icon: (
                    <IconUser
                      size={16}
                      className="text-neutral-400 dark:text-neutral-500"
                    />
                  ),
                  href: "https://www.asius.in/",
                  label: "asius.in",
                  aria: "Visit the developer's portfolio at asius.in (opens in a new tab)",
                },
                {
                  icon: (
                    <IconCode
                      size={16}
                      className="text-neutral-400 dark:text-neutral-500"
                    />
                  ),
                  href: "https://github.com/asius09/shortly",
                  label: "Source Code",
                  aria: "View the Shortly source code on GitHub (opens in a new tab)",
                },
                {
                  icon: (
                    <IconBrandGithub
                      size={16}
                      className="text-neutral-400 dark:text-neutral-500"
                    />
                  ),
                  href: "https://github.com/asius09",
                  label: "@asius09",
                  aria: "Visit the developer's GitHub profile (opens in a new tab)",
                },
              ];
              return (
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                  {aboutLinks.map((item) => (
                    <div
                      key={item.href}
                      className="flex items-center gap-2 bg-neutral-100 px-3 py-1 dark:bg-neutral-900"
                    >
                      {item.icon}
                      <Link
                        href={item.href}
                        aria-label={item.aria}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-neutral-800 underline-offset-2 transition-colors hover:font-semibold hover:text-neutral-900 hover:underline dark:text-neutral-100 dark:hover:text-neutral-50"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </Card>
    </div>
  );
}
