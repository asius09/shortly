"use client";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { useState } from "react";
import { LoginFormSchema } from "@/schema/loginForm.schema";
import { errorHandler, handleZodErros } from "@/utils/errorHandler";
import { useToast } from "./ui/Toast";
import { handleLogin } from "@/lib/user.api";
import { useUser } from "@/context/user";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const { setUser, user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { addToast } = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const parsed = LoginFormSchema.parse(form);
      const response = await handleLogin({
        email: parsed.email,
        password: parsed.password,
      });

      const user = await response.data.user;
      setUser({
        id: String(user._id),
        email: user.email,
        fullName: user.fullName,
      });
      setForm({
        email: "",
        password: "",
      });
      addToast({
        id: Date.now(),
        message: "Logged in successfully!",
        type: "success",
      });
    } catch (err: unknown) {
      const fieldErrors = handleZodErros(err);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        addToast({
          id: Date.now(),
          message: "Please fix the highlighted errors.",
          type: "error",
        });
      } else {
        const general = errorHandler(err);
        setErrors((prev) => ({ ...prev, general }));
        addToast({
          id: Date.now(),
          message: general,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <Card>
      <CardTitle>Login to Shortly</CardTitle>
      <CardDescription>Please enter your credentials.</CardDescription>
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <div className="w-full space-y-3">
          <Input
            label="Email"
            placeholder="Enter Your Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            onChange={handleInputs}
            error={errors.email}
            disabled={loading}
          />
          <Input
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            onChange={handleInputs}
            error={errors.password}
            disabled={loading}
          />
          <Button
            className="flex w-full items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <IconLoader className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href="/forgot-password"
            className={`text-sm hover:underline ${
              loading
                ? "pointer-events-none text-neutral-400 dark:text-neutral-500"
                : "text-blue-600 dark:text-blue-400"
            }`}
            tabIndex={loading ? -1 : 0}
            aria-disabled={loading}
          >
            Forgot password?
          </Link>
        </div>
      </form>
      <div className="my-2 w-full border-[0.25px] border-neutral-600" />
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 text-sm">
        <span className="text-neutral-600 dark:text-neutral-300">
          Don&apos;t have an account?
        </span>
        <Link
          href="/signup"
          className="w-full"
          tabIndex={loading ? -1 : 0}
          aria-disabled={loading}
        >
          <Button
            variant="outline"
            type="button"
            className="w-full"
            disabled={loading}
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </Card>
  );
};
