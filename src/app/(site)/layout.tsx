import { PagePanel } from "@/components/ui/PagePanel";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagePanel className="mt-10 sm:mt-14">{children}</PagePanel>;
}
