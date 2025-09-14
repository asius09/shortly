import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center pt-20 pb-8">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
}
