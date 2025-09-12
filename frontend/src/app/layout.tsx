import type { Metadata } from "next";
import { Inter, Fira_Mono } from "next/font/google";
import "./globals.css";
import { DialogProvider } from "@/components/ui/Dialog";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <main
          id="shortly-app"
          className="min-svh relative mx-auto flex h-dvh max-h-screen w-full max-w-4xl flex-col items-center justify-start bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100"
        >
          <Header />
          <ToastProvider>
            <DialogProvider>{children}</DialogProvider>
          </ToastProvider>
          <Footer />
        </main>
      </body>
    </html>
  );
}
