import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ message: "Invalid email adddress" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long" })
    .max(20, { message: "Password must be under 20 characters" })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and symbol",
    }),
});
