"use client";
import { useState } from "react";
import { handleCopy } from "@/utils/handleCopy";
import { Button, ButtonProps } from "./ui/Button";
import { IconCopy } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

interface CopyButtonProps extends ButtonProps {
  text: string;
  iconOnly?: boolean;
}

export function CopyButton({ text, className, iconOnly = false, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      onClick={() => handleCopy({ text, setCopied })}
      aria-label="Copy short URL"
      type="button"
      className={cn(className, "gap-1 text-xs")}
      {...props}
    >
      <IconCopy size={16} />
      {!iconOnly && (copied ? "Copied!" : "Copy")}
    </Button>
  );
}
