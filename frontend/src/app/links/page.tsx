import { LinkTable } from "@/components/LinkTable";

export type LinkType = {
  id: string;
  URL: string;
  originalUrl: string;
  createdAt: string;
};

export default function LinksPage() {
  return (
    <div className="mt-20 flex h-full w-full flex-col items-center justify-start px-6">
      <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Your Shortened Links
      </h2>
      <LinkTable />
    </div>
  );
}
