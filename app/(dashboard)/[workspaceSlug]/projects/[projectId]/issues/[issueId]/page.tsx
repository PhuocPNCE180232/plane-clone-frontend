import { IssueDetailPage } from "@/components/features/issues/IssueDetailPage";

interface PageProps {
  params: Promise<{
    workspaceSlug: string;
    projectId: string;
    issueId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { projectId, issueId } = await params;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <IssueDetailPage
          key={`${projectId}-${issueId}`}
          issueId={issueId}
          projectId={projectId}
        />
      </div>
    </div>
  );
}
