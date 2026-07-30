import { PagePanel } from "@/components/ui/PagePanel";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagePanel>{children}</PagePanel>;
}
