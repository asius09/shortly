"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { Card } from "./ui/Card";
import { deleteUrl, getUrls } from "@/lib/url.api";
import { UrlType } from "@/types/url.type";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { IconLoader, IconTrashFilled } from "@tabler/icons-react";
import { ToolTip } from "./ui/ToolTip";
import { errorHandler } from "@/utils/errorHandler";
import { useToast } from "./ui/Toast";

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
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const userId = user?.id;
  const [links, setLinks] = useState<UrlType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add delete loading state
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      <div className="flex w-full items-center justify-center">
        <Card className="w-full py-8 text-center text-base text-neutral-400 dark:text-neutral-500">
          Loading links...
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full items-center justify-center">
        <Card className="w-full py-8 text-center text-base text-red-500 dark:text-red-400">
          {error}
        </Card>
      </div>
    );
  }

  if (!Array.isArray(links) || links.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <Card className="w-full py-8 text-center text-base text-neutral-400 dark:text-neutral-500">
          No links found.
        </Card>
      </div>
    );
  }

  const handleDelete = async (link: UrlType) => {
    if (!link._id || !userId) {
      addToast({
        id: Date.now(),
        message: "Invalid link. Cannot delete.",
        type: "error",
      });
      return;
    }
    setDeletingId(link._id);
    try {
      await deleteUrl(link._id, userId!);
      setLinks((prev) => prev.filter((l) => l._id !== link._id));
      addToast({
        id: Date.now(),
        message: "Link deleted successfully.",
        type: "success",
      });
    } catch (err: unknown) {
      const error = errorHandler(err);
      addToast({
        id: Date.now(),
        message: error,
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="mx-auto w-full max-w-7xl overflow-x-auto p-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="w-[25%] rounded-tl-lg bg-neutral-100 px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  Short URL
                </th>
                <th className="w-[40%] bg-neutral-100 px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  Original URL
                </th>
                <th className="w-[15%] bg-neutral-100 px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  Expires In
                </th>
                <th className="w-[10%] bg-neutral-100 px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  Clicks
                </th>
                <th className="w-[10%] rounded-tr-lg bg-neutral-100 px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
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
                  <td className="p-4 text-center align-middle">
                    {link.shortUrl ? (
                      <div className="flex flex-col items-center gap-1">
                        <Link
                          href={link.shortUrl}
                          className="max-w-full font-mono text-sm break-all text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.shortUrl}
                        >
                          {link.shortUrl.length > 40
                            ? `${link.shortUrl.substring(0, 40)}...`
                            : link.shortUrl}
                        </Link>
                        <span className="text-xs text-neutral-400">
                          Click to visit
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-center align-middle">
                    <div className="max-w-full">
                      <span
                        className="block text-sm break-all text-neutral-600 dark:text-neutral-400"
                        title={link.originalUrl}
                      >
                        {link.originalUrl.length > 60
                          ? `${link.originalUrl.substring(0, 60)}...`
                          : link.originalUrl}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center align-middle text-sm text-neutral-500 dark:text-neutral-400">
                    {link.createdAt ? (
                      getExpireIn(link.createdAt)
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-center align-middle text-sm text-neutral-700 dark:text-neutral-200">
                    {typeof link.click === "number" ? link.click : 0}
                  </td>
                  <td className="p-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <CopyButton
                        text={link.shortUrl || ""}
                        className="p-2"
                        iconOnly={true}
                      />

                      <ToolTip content={"Delete"} side="top" delay={100}>
                        <Button
                          className="p-2"
                          title="Delete"
                          variant="destructive"
                          onClick={() => handleDelete(link)}
                          type="button"
                          disabled={deletingId === link._id}
                        >
                          {deletingId === link._id ? (
                            <IconLoader size={16} className="animate-spin" />
                          ) : (
                            <IconTrashFilled size={16} />
                          )}
                        </Button>
                      </ToolTip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Tablet View */}
      <div className="hidden md:block lg:hidden">
        <div className="space-y-4">
          {links.map((link, idx) => (
            <Card key={link._id} className="w-full p-6">
              <div className="space-y-4">
                {/* Short URL */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Short URL
                  </h3>
                  {link.shortUrl ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href={link.shortUrl}
                        className="font-mono text-sm break-all text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.shortUrl}
                      </Link>
                      <span className="text-xs text-neutral-400">
                        Click to visit
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-400">N/A</span>
                  )}
                </div>

                {/* Original URL */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Original URL
                  </h3>
                  <p
                    className="text-sm break-all text-neutral-600 dark:text-neutral-400"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Expires In
                    </span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      {link.createdAt ? getExpireIn(link.createdAt) : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Clicks
                    </span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      {typeof link.click === "number" ? link.click : 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2 pt-4">
                  <CopyButton
                    text={link.shortUrl || ""}
                    className="flex-1 justify-center"
                    iconOnly={false}
                  />
                  <Button
                    className="flex-1"
                    title="Delete"
                    variant="destructive"
                    onClick={() => handleDelete(link)}
                    type="button"
                    disabled={deletingId === link._id}
                  >
                    {deletingId === link._id ? (
                      <IconLoader size={16} className="animate-spin" />
                    ) : (
                      <IconTrashFilled size={16} className="mr-1" />
                    )}
                    {deletingId === link._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block space-y-4 md:hidden">
        {links.map((link, idx) => (
          <Card key={link._id} className="w-full p-4">
            <div className="space-y-4">
              {/* Short URL */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Short URL
                </h3>
                {link.shortUrl ? (
                  <div className="flex flex-col gap-1">
                    <Link
                      href={link.shortUrl}
                      className="font-mono text-sm break-all text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.shortUrl}
                    </Link>
                    <span className="text-xs text-neutral-400">
                      Tap to visit
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">N/A</span>
                )}
              </div>

              {/* Original URL */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Original URL
                </h3>
                <p
                  className="text-sm break-all text-neutral-600 dark:text-neutral-400"
                  title={link.originalUrl}
                >
                  {link.originalUrl}
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Expires In
                  </span>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {link.createdAt ? getExpireIn(link.createdAt) : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Clicks
                  </span>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    {typeof link.click === "number" ? link.click : 0}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-4">
                <CopyButton
                  text={link.shortUrl || ""}
                  className="w-full justify-center text-xs"
                  iconOnly={false}
                />
                <Button
                  className="w-full text-xs"
                  title="Delete"
                  variant="destructive"
                  onClick={() => handleDelete(link)}
                  type="button"
                  disabled={deletingId === link._id}
                >
                  {deletingId === link._id ? (
                    <IconLoader size={16} className="animate-spin" />
                  ) : (
                    <IconTrashFilled size={14} className="mr-1" />
                  )}
                  {deletingId === link._id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
