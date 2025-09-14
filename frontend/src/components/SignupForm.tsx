"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { SignupFormSchema } from "@/schema/signupForm.schema";
import { IconLoader } from "@tabler/icons-react";
import { errorHandler, handleZodErros } from "@/utils/errorHandler";
import { useToast } from "./ui/Toast";
import { handleSignup } from "@/lib/user.api";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

export const SignupForm = () => {
  const { setUser, user } = useUser();

  const router = useRouter();

  if (user) {
    router.push("/");
    return null;
  }
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { addToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      // Validate with zod
      const parse = SignupFormSchema.parse(form);

      const response = await handleSignup({
        email: parse.email,
        fullName: parse.fullName,
        password: parse.password,
      });

      const user = response.data.user;

      setUser({
        id: String(user._id),
        email: user.email,
        fullName: user.fullName,
      });

      setForm({
        fullName: "",
        email: "",
        password: "",
      });

      addToast({
        id: Date.now(),
        message: "Sign Up Successfully! Logging you in.",
        type: "success",
      });
    } catch (err: unknown) {
      const fieldErrors = handleZodErros(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        const general = errorHandler(err);
        setErrors((prev) => ({ ...prev, general: general }));
        addToast({
          id: Date.now(),
          message: general,
          type: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardTitle>Sign Up for Shortly</CardTitle>
      <CardDescription>Create your account to get started.</CardDescription>
      <form className="w-full" onSubmit={handleSubmit} noValidate>
        <div className="w-full space-y-3">
          <Input
            label="Full Name"
            placeholder="Enter Your Name"
            type="text"
            name="fullName"
            autoComplete="name"
            required
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />
          <Input
            label="Email"
            placeholder="Enter Your Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Create a Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button
            className="mt-2 flex w-full items-center justify-center"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <IconLoader className="animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Already have an account?
          </Link>
        </div>
      </form>
      <div className="my-2 w-full border-[0.25px] border-neutral-600" />
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 text-sm">
        <span className="text-neutral-600 dark:text-neutral-300">
          Already have an account?
        </span>
        <Link href="/login" className="w-full">
          <Button variant="outline" type="button" className="w-full">
            Login
          </Button>
        </Link>
      </div>
    </Card>
  );
};
