"use client";
// import { CopyUrlDialog } from "@/components/CopyUrlDialog";
import { ShortendedForm } from "@/components/ShortendedForm";

export default function Home() {
  // const { close, isOpen, open } = useDialog();
  // open({
  //   title: "Shortened URL Copied!",
  //   subTitle:
  //     "Your shortened link has been copied to the clipboard. You can now share it with anyone.",
  //   content: <CopyUrlDialog />,
  // });

  return (
    <div className="flex h-full w-full items-center justify-center">
      <ShortendedForm />
    </div>
  );
}
