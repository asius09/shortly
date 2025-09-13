const { z } = require('zod');

// User registration schema
const userRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full Name must be at least 3 characters')
    .max(20, 'Full Name must not exceed 20 characters')
    .trim(),
  email: z
    .email({
      message: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Email is required.';
        }
        // If it's not a valid email, zod will call this with the invalid input
        return 'Invalid email format.';
      },
    })
    .trim(),
  password: z
    .string({
      error: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Password is required.';
        }
        if (iss.code === 'invalid_type') {
          return 'Password must be a string.';
        }
        return 'Invalid password input.';
      },
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must not exceed 20 characters' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      'Password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
});

// User login schema with custom error example
const userLoginSchema = z.object({
  email: z
    .email({
      message: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Email is required.';
        }
        // If it's not a valid email, zod will call this with the invalid input
        return 'Invalid email format.';
      },
    })
    .trim(),
  password: z
    .string({
      error: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Password is required.';
        }
        if (iss.code === 'invalid_type') {
          return 'Password must be a string.';
        }
        return 'Invalid password input.';
      },
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must not exceed 20 characters' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      'Password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
});

// User update schema (optional fields)
const userUpdateSchema = z.object({
  fullName: z
    .string('Full Name is required')
    .min(3, 'Full Name must be at least 3 characters')
    .max(20, 'Full Name must not exceed 20 characters')
    .trim()
    .optional(),
  email: z
    .email({
      message: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Email is required.';
        }
        // If it's not a valid email, zod will call this with the invalid input
        return 'Invalid email format.';
      },
    })
    .trim(),
  password: z
    .string({
      error: (iss) => {
        if (iss.input === undefined || iss.input === null || iss.input === '') {
          return 'Password is required.';
        }
        if (iss.code === 'invalid_type') {
          return 'Password must be a string.';
        }
        return 'Invalid password input.';
      },
    })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(20, { message: 'Password must not exceed 20 characters' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      'Password must contain lowercase, uppercase, number, and special character',
    )
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
    .string('Current Password is required')
    .min(8, 'Current password must be at least 8 characters')
    .max(20, 'Current password must not exceed 20 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Current password must contain lowercase, uppercase, number, and special character',
    )
    .trim(),
  newPassword: z
    .string('New Password is required')
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
