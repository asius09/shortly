import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "./globals.css";
import { DialogProvider } from "@/components/ui/Dialog";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserProvider } from "@/context/user";
import { cookies } from "next/headers";
import axios from "axios";

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

// Server-side function to fetch user info from API route using axios
async function fetchUserServer(): Promise<{
  id: string;
  email: string;
  fullName: string;
} | null> {
  try {
    // Use next/headers to get cookies for SSR
    const cookieHeader = cookies().toString();

    // Call the API route directly (relative path, since we're on the same host)
    const res = await axios.post(
      "/api/user/me",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        // withCredentials is not needed for server-to-server, but harmless
        withCredentials: true,
      },
    );
    const data = res.data;
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
  // This is similar to how you would use @user.api.ts for login/session
  // NOTE: UserProvider must be updated to accept initialUser prop for this to work.
  // If not, you must update UserProvider in context/user.tsx to accept and use initialUser.
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
            className="min-svh relative mx-auto flex h-dvh max-h-screen w-full max-w-4xl flex-col items-center justify-start bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100"
          >
            <ToastProvider>
              <Header />
              <DialogProvider>{children}</DialogProvider>
            </ToastProvider>
            <Footer />
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
