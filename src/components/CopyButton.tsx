"use client";
import { useState } from "react";
import { handleCopy } from "@/utils/handleCopy";
import { Button, ButtonProps } from "./ui/Button";
import { IconCopy } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

interface CopyButtonProps extends ButtonProps {
  text: string;
}

export function CopyButton({ text, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={() => handleCopy({ text, setCopied })}
      aria-label="Copy short URL"
      type="button"
      className={cn(className, "gap-1 text-xs")}
      {...props}
    >
      <IconCopy size={12} />
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
