import { IssuePage } from "@/components/features/issues/IssuePage";

interface IssuesPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function IssuesPage({ params }: IssuesPageProps) {
  const { projectId } = await params;

  return <IssuePage projectId={projectId} />;
}
