'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { Card } from "./ui/Card";
import { getUrls } from "@/lib/url.api";
import { UrlType } from "@/types/url.type";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

type LinkTableProps = {
  userId?: string;
};

export const LinkTable = ({ userId }: LinkTableProps) => {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }
  const [links, setLinks] = useState<UrlType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getUrls(userId)
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch links");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Card className="w-full py-12 text-center text-lg text-neutral-400 dark:text-neutral-500">
        Loading links...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full py-12 text-center text-lg text-red-500 dark:text-red-400">
        {error}
      </Card>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="w-full py-12 text-center text-lg text-neutral-400 dark:text-neutral-500">
        No links found.
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-full overflow-x-auto p-0">
      <table className="w-full min-w-[350px]">
        <thead>
          <tr>
            <th className="rounded-tl-lg bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Short URL
            </th>
            <th className="bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Original URL
            </th>
            <th className="bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Expire In
            </th>
            <th className="bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Clicks
            </th>
            <th className="rounded-tr-lg bg-neutral-100 px-4 py-3 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, idx) => (
            <tr
              key={link.id}
              className={`transition hover:bg-blue-50 dark:hover:bg-blue-950 ${
                idx % 2 === 0
                  ? "bg-neutral-50 dark:bg-neutral-950"
                  : "bg-white dark:bg-neutral-900"
              }`}
            >
              <td className="px-4 py-4 text-center align-middle">
                <Link
                  href={link.shortUrl ?? "#"}
                  className="font-mono text-xs text-nowrap break-all text-blue-500 underline underline-offset-3 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.shortUrl}
                </Link>
              </td>
              <td className="max-w-[250px] truncate px-4 py-4 text-center align-middle text-xs text-neutral-600 dark:text-neutral-400">
                <a
                  href={link.originalUrl}
                  className="break-all hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.originalUrl}
                </a>
              </td>
              <td className="px-4 py-4 text-center align-middle text-xs text-neutral-400 dark:text-neutral-500">
                {link.createdAt}
              </td>
              <td className="px-4 py-4 text-center align-middle text-xs text-neutral-700 dark:text-neutral-300">
                {link.click}
              </td>
              <td className="min-w-40 px-4 py-4 text-center align-middle">
                <CopyButton text={link.shortUrl} className="py-1" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
