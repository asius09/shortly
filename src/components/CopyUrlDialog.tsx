import { IconCopy } from "@tabler/icons-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export const CopyUrlDialog = () => {
  return (
    <div className="w-full">
      <Input
        value={
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, aut repudiandae accusantium officiis deserunt illo enim dolore sit nihil sed magni id, est atque odio odit? Quis error necessitatibus pariatur?"
        }
        as="textarea"
        readOnly
        className="pointer-events-none cursor-alias"
      />
      <div className="flex w-full flex-row items-center justify-center gap-3">
        <Button
          className="w-full gap-2"
          aria-label="Copy shortened link"
          disabled={false}
          // onClick={}
        >
          <IconCopy size={16} />
          Copy
        </Button>
        <Button
          className="w-full gap-2"
          variant="secondary"
          aria-label="Copy shortened link"
          disabled={false}
          onClick={close}
        >
          Cancle
        </Button>
      </div>
    </div>
  );
};
