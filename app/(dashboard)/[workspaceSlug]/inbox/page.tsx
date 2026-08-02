import { InboxPage } from "@/components/features/inbox/InboxPage";

interface InboxRoutePageProps {
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export default async function InboxRoutePage({ params }: InboxRoutePageProps) {
  const { workspaceSlug } = await params;

  return <InboxPage workspaceSlug={workspaceSlug} />;
}
