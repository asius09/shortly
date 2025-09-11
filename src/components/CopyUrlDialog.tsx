import { Input } from "./ui/Input";
import { CopyButton } from "./CopyButton";

export const CopyUrlDialog = ({ shortenedUrl }: { shortenedUrl: string }) => {
  return (
    <div className="w-full">
      <Input
        value={shortenedUrl}
        as="textarea"
        readOnly
        className="pointer-events-none cursor-alias"
      />
      <div className="flex w-full flex-row items-center justify-center gap-3">
        <CopyButton text={shortenedUrl} disabled={!shortenedUrl} />
      </div>
    </div>
  );
};
