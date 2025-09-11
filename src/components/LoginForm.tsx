import Link from "next/link";
import { Button } from "./ui/Button";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";

export const LoginForm = () => {
  return (
    <Card>
      <CardTitle>Login to Shortly</CardTitle>
      <CardDescription>Please enter your credentials.</CardDescription>
      <form
        action="
        "
        className="w-full"
      >
        <div className="w-full">
          <Input
            label="Email"
            placeholder="Enter Your Email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            placeholder="Enter Your Password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
          <Button className="w-full" type="submit">
            Login
          </Button>
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </form>
      <div className="my-2 w-full border-[0.25px] border-neutral-600" />
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 text-sm">
        <span className="text-neutral-600 dark:text-neutral-300">
          Don't have an account?
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
