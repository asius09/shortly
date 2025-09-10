export const handleCopyToClipboard = (copyText: string) => {
  if (!copyText || copyText === "") throw new Error("Text required to copy");
  try {
    navigator.clipboard.writeText(copyText);
    return true; // for handle of verification;
  } catch {
    return false;
  }
};
