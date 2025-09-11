import Link from "next/link";
import { Button } from "./ui/Button";
import { Card, CardDescription, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";

export const SignupForm = () => {
  return (
    <Card>
      <CardTitle>Sign Up for Shortly</CardTitle>
      <CardDescription>Create your account to get started.</CardDescription>
      <form className="w-full">
        <div className="w-full">
          <Input
            label="Name"
            placeholder="Enter Your Name"
            type="text"
            name="name"
            autoComplete="name"
            required
          />
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
            placeholder="Create a Password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
          />
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
          <div className="mt-2 flex justify-end">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Already have an account?
            </Link>
          </div>
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
