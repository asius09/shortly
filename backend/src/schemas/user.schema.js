const { z } = require('zod');

// User registration schema
const userRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full Name must be at least 3 characters')
    .max(20, 'Full Name must not exceed 20 characters')
    .trim(),
  email: z.email('Invalid email format').trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
});

// User login schema
const userLoginSchema = z.object({
  email: z.string().email('Invalid email format').trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
});

// User update schema (optional fields)
const userUpdateSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full Name must be at least 3 characters')
    .max(20, 'Full Name must not exceed 20 characters')
    .trim()
    .optional(),
  email: z.string().email('Invalid email format').trim().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .trim()
    .optional(),
});

// Refresh token schema
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').trim(),
});

// Password change schema
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, 'Current password must be at least 8 characters')
    .max(20, 'Current password must not exceed 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Current password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(20, 'New password must not exceed 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'New password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  userUpdateSchema,
  refreshTokenSchema,
  changePasswordSchema,
};
