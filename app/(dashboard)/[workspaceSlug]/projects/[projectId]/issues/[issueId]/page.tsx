import { IssueDetailPage } from "@/components/features/issues/IssueDetailPage";

interface PageProps {
  params: Promise<{
    workspaceSlug: string;
    issueId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { issueId } = await params;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <IssueDetailPage issueId={issueId} />
      </div>
    </div>
  );
}