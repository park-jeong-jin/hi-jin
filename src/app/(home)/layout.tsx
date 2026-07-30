import { PagePanel } from "@/components/ui/PagePanel";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PagePanel className="mt-14 sm:mt-20">{children}</PagePanel>;
}
