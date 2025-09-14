import { LinkTable } from "@/components/LinkTable";

export type LinkType = {
  id: string;
  URL: string;
  originalUrl: string;
  createdAt: string;
};

export default function LinksPage() {
  return (
    <div className="w-full pt-20 pb-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
          Your Shortened Links
        </h2>
        <LinkTable />
      </div>
    </div>
  );
}
