import { z } from "zod";

export const ShortenedFormSchema = z.object({
  originalUrl: z
    .url({ message: "Please enter a valid original URL" })
    .max(2048, { message: "URL is too long" }),
  shortenedUrl: z
    .url({ message: "Please enter a valid shortened URL" })
    .max(2048, { message: "URL is too long" }),
  createdAt: z.iso.datetime({ message: "Creation date is required" }),
});
