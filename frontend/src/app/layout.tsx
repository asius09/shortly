import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "./globals.css";
import { DialogProvider } from "@/components/ui/Dialog";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserProvider } from "@/context/user";
import { cookies } from "next/headers";

// Font setup
const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Fira_Mono({
  weight: ["400", "500", "700"],
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shortly URL Shortener",
  description:
    "Shortly is a simple URL shortener website built with Next.js, MongoDB, and Mongoose. Practice and enhance your backend development skills with this practical application.",
};

// Server-side function to fetch user info from API route using fetch
async function fetchUserServer(): Promise<{
  id: string;
  email: string;
  fullName: string;
} | null> {
  try {
    // Use next/headers to get cookies for SSR
    const cookieHeader = (await cookies()).toString();

    // Use API_BASE_URL from env (default to http://localhost:8000 if not set)
    const API_BASE_URL =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8000/";

    // Ensure no trailing slash
    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    const url = `${baseUrl}/api/user/me`;

    // Call the API route using absolute URL (for SSR)
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      next: { revalidate: 0 }, // Uncomment if you want to disable cache
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (data?.data?.user) {
      return {
        id: String(data.data.user.id || data.data.user._id),
        email: data.data.user.email,
        fullName: data.data.user.fullName,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user on the server before rendering
  const user = await fetchUserServer();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        {/* Pass user from server to context for all children */}
        <UserProvider initialUser={user}>
          <main
            id="shortly-app"
            className="relative min-h-screen w-full bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100"
          >
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
              <ToastProvider>
                <Header />
                <div className="mx-auto w-full max-w-6xl flex-1">
                  <DialogProvider>{children}</DialogProvider>
                </div>
              </ToastProvider>
              <Footer />
            </div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
