import { z } from "zod";

export const ShortenedFormSchema = z.object({
  originalUrl: z
    .url({ message: "Please enter a valid original URL" })
    .max(2048, { message: "URL is too long" }),
  alias: z
    .string()
    .min(1, { message: "Alias is required" })
    .max(50, { message: "Alias is too long" })
    .regex(/^[a-zA-Z0-9_\-\.~]+$/, {
      message:
        "Alias can only contain letters, numbers, underscores, hyphens, dots, and tildes",
    }),
  createdAt: z.iso
    .datetime({ message: "Creation date is required" })
    .optional(),
});
