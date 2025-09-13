"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { Card } from "./ui/Card";
import { getUrls } from "@/lib/url.api";
import { UrlType } from "@/types/url.type";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import {
  IconEdit,
  IconInfoCircleFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import { collectSegmentData } from "next/dist/server/app-render/collect-segment-data";

// Helper to calculate "Expire In" (days left, max 7 days)
function getExpireIn(createdAt: string): string {
  if (!createdAt) return "N/A";
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return "N/A";
  const now = new Date();
  const maxDays = 7;
  const expireDate = new Date(created);
  expireDate.setDate(expireDate.getDate() + maxDays);
  const msLeft = expireDate.getTime() - now.getTime();
  if (msLeft <= 0) return "Expired";
  const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "<1h";
}

export const LinkTable = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const userId = user?.id;
  const [links, setLinks] = useState<UrlType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(links);
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setLinks([]);
      return;
    }
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUrls(userId);
        const data = response.data;
        setLinks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch links");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [userId]);

  if (!user) return null;

  if (loading) {
    return (
      <Card className="w-full py-8 text-center text-base text-neutral-400 dark:text-neutral-500">
        Loading links...
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full py-8 text-center text-base text-red-500 dark:text-red-400">
        {error}
      </Card>
    );
  }

  if (!Array.isArray(links) || links.length === 0) {
    return (
      <Card className="w-full py-8 text-center text-base text-neutral-400 dark:text-neutral-500">
        No links found.
      </Card>
    );
  }

  const handleEdit = (link: UrlType) => {
    alert(`Edit link: ${link.shortUrl || link._id}`);
  };

  const handleDelete = (link: UrlType) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setLinks((prev) => prev.filter((l) => l._id !== link._id));
      // TODO: Call deleteUrl API
    }
  };

  return (
    <Card className="w-full max-w-full overflow-x-auto p-0">
      <table className="w-full min-w-[320px]">
        <thead>
          <tr>
            <th className="rounded-tl-lg bg-neutral-100 px-2 py-1 text-center text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Short URL
            </th>
            <th className="bg-neutral-100 px-2 py-1 text-center text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Expire In
            </th>
            <th className="bg-neutral-100 px-2 py-1 text-center text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Clicks
            </th>
            <th className="rounded-tr-lg bg-neutral-100 px-2 py-1 text-center text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, idx) => (
            <tr
              key={link._id}
              className={`transition ${
                idx % 2 === 0
                  ? "bg-neutral-50 dark:bg-neutral-950"
                  : "bg-white dark:bg-neutral-900"
              } hover:bg-neutral-200 dark:hover:bg-neutral-800`}
            >
              <td className="p-2 text-center align-middle">
                {link.shortUrl ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <Link
                      href={link.shortUrl}
                      className="font-mono text-xs text-nowrap break-all text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.shortUrl}
                    </Link>
                    <span className="block max-w-[120px] truncate text-[9px] text-neutral-400 dark:text-neutral-500">
                      {link.originalUrl}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400">N/A</span>
                )}
              </td>
              <td className="px-2 py-2 text-center align-middle text-xs text-neutral-500 dark:text-neutral-400">
                {link.createdAt ? (
                  getExpireIn(link.createdAt)
                ) : (
                  <span className="text-xs text-neutral-400">N/A</span>
                )}
              </td>
              <td className="px-2 py-2 text-center align-middle text-xs text-neutral-700 dark:text-neutral-200">
                {typeof link.click === "number" ? link.click : 0}
              </td>
              <td className="px-2 py-2 text-center align-middle">
                <div className="flex items-center justify-center gap-1">
                  <CopyButton
                    text={link.shortUrl || ""}
                    className="p-2"
                    iconOnly={true}
                  />
                  <Button
                    className="p-2"
                    title="Edit"
                    variant="info"
                    onClick={() => handleEdit(link)}
                    type="button"
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    className="p-2"
                    title="Delete"
                    variant="destructive"
                    onClick={() => handleDelete(link)}
                    type="button"
                  >
                    <IconTrashFilled size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
