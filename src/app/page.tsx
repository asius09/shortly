"use client";
import { CopyUrlDialog } from "@/components/CopyUrlDialog";
import { Form } from "@/components/Form";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { useDialog } from "@/components/ui/Dialog";

export default function Home() {
  const { close, isOpen, open } = useDialog();
  // open({
  //   title: "Shortened URL Copied!",
  //   subTitle:
  //     "Your shortened link has been copied to the clipboard. You can now share it with anyone.",
  //   content: <CopyUrlDialog />,
  // });

  return (
    <main
      id="shortly-app"
      className="min-svh relative mx-auto flex h-dvh max-h-screen w-full max-w-4xl items-center justify-center"
    >
      <Header />
      <Card>
        <Form />
      </Card>
    </main>
  );
}
