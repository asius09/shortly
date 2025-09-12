type HandleCopyParams = {
  text: string;
  setCopied: (value: boolean) => void;
};

export const handleCopy = async ({ text, setCopied }: HandleCopyParams) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  } catch {
    setCopied(false);
  }
};
