import { LinkTable } from "@/components/LinkTable";

export type LinkType = {
  id: string;
  URL: string;
  originalUrl: string;
  createdAt: string;
};

export default function LinksPage() {
  const links: LinkType[] = [
    {
      id: "1",
      URL: "https://sho.rt/abc123",
      originalUrl: "https://www.example.com/very/long/url/1",
      createdAt: "2024-06-01 10:30",
    },
    {
      id: "2",
      URL: "https://sho.rt/xyz789",
      originalUrl: "https://www.anotherdomain.com/some/other/long/url/2",
      createdAt: "2024-06-02 14:15",
    },
    {
      id: "3",
      URL: "https://sho.rt/def456",
      originalUrl: "https://www.something.com/path/to/resource/3",
      createdAt: "2024-06-03 09:05",
    },
  ];

  return (
    <div className="mt-20 flex h-full w-full flex-col items-center justify-start">
      <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Your Shortened Links
      </h2>
      <LinkTable links={links} />
    </div>
  );
}
