const mongoose = require('mongoose');
const { z } = require('zod');

// Mongoose _id Object Type
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid User Id',
  });

// URL schema for both create and update operations
const urlSchema = z.object({
  originalUrl: z.url('Invalid URL format').trim(),
  alias: z
    .string()
    .min(3, 'Short code must be at least 3 characters')
    .max(20, 'Short code must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Short code can only contain letters, numbers, underscores, and hyphens',
    )
    .trim(),
  userId: objectIdSchema.optional(),
  createdAt: z.iso.datetime({ local: true }),
});

module.exports = urlSchema;
