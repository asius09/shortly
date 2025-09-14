"use client";
import { useState } from "react";
import { handleCopy } from "@/utils/handleCopy";
import { Button, ButtonProps } from "./ui/Button";
import { IconCopy } from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { ToolTip } from "./ui/ToolTip";

interface CopyButtonProps extends ButtonProps {
  text: string;
  iconOnly?: boolean;
}

export function CopyButton({ text, className, iconOnly = false, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  // Tooltip content logic
  const tooltipContent = copied ? "Copied!" : "Copy to clipboard";

  return (
    <ToolTip content={tooltipContent} side="top" delay={100}>
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
    </ToolTip>
  );
}
