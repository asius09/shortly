"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { z } from "zod";

const urlSchema = z.object({
  enterURL: z
    .string()
    .min(1, { message: "URL is required" })
    .url({ message: "Please enter a valid URL" }),
  alias: z
    .string()
    .min(1, { message: "Alias is required" })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message:
        "Alias can only contain letters, numbers, hyphens, and underscores",
    }),
});

export const Form = () => {
  const [formInputs, setFormInputs] = useState({
    enterURL: "",
    alias: "",
    shortURL: "",
  });

  const [errorEnterURL, setErrorEnterURL] = useState<undefined | string>(
    undefined,
  );
  const [errorAlias, setErrorAlias] = useState<undefined | string>(undefined);

  const handleChange = (name: string, value: string) => {
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on change
    if (name === "enterURL") {
      setErrorEnterURL(undefined);
    }
    if (name === "alias") {
      setErrorAlias(undefined);
    }
  };

  const validateForm = () => {
    const result = urlSchema.safeParse({
      enterURL: formInputs.enterURL,
      alias: formInputs.alias,
    });
    if (!result.success) {
      // ZodError.issues is the correct way to get errors
      const urlError = result.error.issues.find(
        (issue) => issue.path[0] === "enterURL",
      );
      const aliasError = result.error.issues.find(
        (issue) => issue.path[0] === "alias",
      );
      setErrorEnterURL(urlError ? urlError.message : undefined);
      setErrorAlias(aliasError ? aliasError.message : undefined);
      return false;
    }
    setErrorEnterURL(undefined);
    setErrorAlias(undefined);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    // Here you would handle the API call to generate the short URL with alias
    // For demonstration, we'll just set a dummy short URL using the alias
    setFormInputs((prev) => ({
      ...prev,
      shortURL: `https://sho.rt/${formInputs.alias || "abc123"}`,
    }));
  };

  return (
    <form
      className="w-full space-y-4"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="w-full text-center">
        <h1
          className="text-3xl font-bold tracking-tight"
          aria-label="Shortly - Shorten Your URL"
        >
          Shortly<span className="sr-only"> - Shorten Your URL</span>
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Paste your long URL below and get a shortened link instantly.
        </p>
      </div>
      <div className="mt-8 flex h-full w-full flex-1 flex-col space-y-4">
        <Input
          placeholder="Paste a long URL here (e.g. https://example.com/...)"
          label="Original URL"
          value={formInputs.enterURL}
          aria-label="Enter the URL you want to shorten"
          onChange={(e) => handleChange("enterURL", e.target.value)}
          error={errorEnterURL}
          type="url"
        />
        <Input
          placeholder="Enter a custom alias (e.g. my-link)"
          label="Custom Alias"
          value={formInputs.alias}
          aria-label="Enter a custom alias for your short URL"
          onChange={(e) => handleChange("alias", e.target.value)}
          error={errorAlias}
          type="text"
        />
        <div className="flex w-full flex-row items-center justify-center gap-3">
          <Button
            className="w-full"
            aria-label="Generate shortened link"
            type="submit"
          >
            Generate
          </Button>
        </div>
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
              <span className="font-medium">Note:</span> Your shortened link is{" "}
              <span className="font-semibold">active for 7 days</span> after
              creation.
            </span>
          </span>
        </div>
      </div>
    </form>
  );
};
