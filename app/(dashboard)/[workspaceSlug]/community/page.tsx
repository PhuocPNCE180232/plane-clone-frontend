import { CommunityPage } from "@/components/features/community/CommunityPage";

interface CommunityRoutePageProps {
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export default async function CommunityRoutePage({
  params,
}: CommunityRoutePageProps) {
  const { workspaceSlug } = await params;

  return <CommunityPage workspaceSlug={workspaceSlug} />;
}
