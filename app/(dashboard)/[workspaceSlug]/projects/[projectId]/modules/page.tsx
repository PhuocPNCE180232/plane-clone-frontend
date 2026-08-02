import { ModulePage } from "@/components/features/modules/ModulePage";

interface ModulesPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ModulesPage({ params }: ModulesPageProps) {
  const { projectId } = await params;

  return <ModulePage projectId={projectId} />;
}
