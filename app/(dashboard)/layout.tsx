import { Layout } from "@/components/shared/Layout";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return <Layout>{children}</Layout>;
}