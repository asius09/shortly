"use client";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { useState } from "react";
import { LoginFormSchema } from "@/schema/loginForm.schema";
import { errorHandler, handleZodErros } from "@/utils/errorHandler";
import { useToast } from "./ui/Toast";

export const LoginForm = () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted with values:", form);
    setLoading(true);
    setErrors({});
    try {
      console.log("Handling Submitting Login Form");
      const parsed = LoginFormSchema.parse(form);
      console.log("Validation successful:", parsed);

      setTimeout(() => {
        setForm({
          email: "",
          password: "",
        });
        console.log("Form reset after login simulation");
        addToast({
          id: Date.now(),
          message: "Logged in successfully!",
          type: "success",
        });
      }, 2000);
    } catch (err: unknown) {
      console.log("Error during login submit:", err);
      const fieldErrors = handleZodErros(err);
      if (Object.keys(fieldErrors).length > 0) {
        console.log("Field errors found:", fieldErrors);
        setErrors(fieldErrors);
        addToast({
          id: Date.now(),
          message: "Please fix the highlighted errors.",
          type: "error",
        });
      } else {
        const general = errorHandler(err);
        console.log("General error:", general);
        setErrors((prev) => ({ ...prev, general }));
        addToast({
          id: Date.now(),
          message: general,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

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
          />
          <Button className="w-full" type="submit">
            Login
          </Button>
        </div>
        <div className="mt-2 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
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
        <Link href="/signup" className="w-full">
          <Button variant="outline" type="button" className="w-full">
            Sign Up
          </Button>
        </Link>
      </div>
    </Card>
  );
};
