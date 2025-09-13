"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import { useToast } from "./ui/Toast";
import { errorHandler, handleZodErros } from "@/utils/errorHandler";
import { ShortenedFormSchema } from "@/schema/shortenedForm.schema";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { IconLoader } from "@tabler/icons-react";
import { createUrl } from "@/lib/url.api";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { CopyUrlDialog } from "./CopyUrlDialog";
import { useDialog } from "./ui/Dialog";

export const ShortendedForm = () => {
  const { open } = useDialog();
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const [form, setForm] = useState({
    originalUrl: "",
    alias: "",
  });
  const { addToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setErrors({});
    if (!user.id) {
      setLoading(false);
      setErrors((prev) => ({
        ...prev,
        general: "User information is missing. Please log in again.",
      }));
      addToast({
        id: Date.now(),
        message: "User information is missing. Please log in again.",
        type: "error",
      });
      return;
    }
    try {
      const parse = ShortenedFormSchema.parse({
        ...form,
        createdAt: new Date().toISOString(),
      });

      const response = await createUrl({
        originalUrl: parse.originalUrl,
        alias: parse.alias,
        userId: user.id,
        createdAt: parse.createdAt,
      });

      const data = response.data.createdUrl;
      open({
        title: "Your Shortened Link is Ready!",
        description: "Here is your new shortened URL. Copy and share it!",
        content: <CopyUrlDialog shortenedUrl={data.shortUrl} />,
      });

      setForm({
        originalUrl: "",
        alias: "",
      });

      addToast({
        id: Date.now(),
        message: "Created shortened URL successfully!",
        type: "success",
      });
    } catch (err: unknown) {
      const fieldErrors = handleZodErros(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        const error = errorHandler(err);
        setErrors((prev) => ({ ...prev, general: error }));
        addToast({
          id: Date.now(),
          message: error,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle
        aria-label="Shortly - Shorten Your URL"
        className="text-center"
      >
        Shortly<span className="sr-only"> - Shorten Your URL</span>
      </CardTitle>
      <CardDescription className="mb-2 text-center">
        Paste your long URL below and get a shortened link instantly.
      </CardDescription>
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full"
        noValidate
      >
        <div className="mt-8 w-full space-y-4">
          <Input
            placeholder="Paste a long URL here (e.g. https://example.com/...)"
            label="Original URL"
            value={form.originalUrl}
            name="originalUrl"
            aria-label="Enter the URL you want to shorten"
            onChange={handleChange}
            error={errors.originalUrl}
            type="url"
            disabled={loading}
          />
          <Input
            placeholder="Enter a custom alias (e.g. my-link)"
            label="Custom Alias"
            value={form.alias}
            name="alias"
            aria-label="Enter a custom alias for your short URL"
            onChange={handleChange}
            error={errors.alias}
            type="text"
            disabled={loading}
          />
          <Button
            className="w-full"
            aria-label="Generate shortened link"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <IconLoader className="animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
          <div className="mt-2 w-full text-center">
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <svg
                className="mr-1 inline-block h-3.5 w-3.5 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M10 6v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
              </svg>
              <span>
                <span className="font-medium">Note:</span> Your shortened link
                is <span className="font-semibold">active for 7 days</span>{" "}
                after creation.
              </span>
            </span>
          </div>
        </div>
      </form>
    </Card>
  );
};
