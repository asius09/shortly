import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center pt-20 pb-8">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
    </div>
  );
}
