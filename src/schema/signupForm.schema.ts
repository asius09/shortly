import { z } from "zod";

export const SignupFormSchema = z.object({
  fullName: z
    .string({ error: "Full Name is Required" })
    .min(2, { message: "Invalid Full Name" })
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message:
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
    }),
  email: z.email({ message: "Invalid email adddress" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long" })
    .max(20, { message: "Password must be under 20 characters" })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and symbol",
    }),
});
