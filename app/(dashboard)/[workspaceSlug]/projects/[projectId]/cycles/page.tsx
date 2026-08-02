import { CyclePage } from "@/components/features/cycles/CyclePage";

interface CyclesPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function CyclesPage({ params }: CyclesPageProps) {
  const { projectId } = await params;

  return <CyclePage projectId={projectId} />;
}
