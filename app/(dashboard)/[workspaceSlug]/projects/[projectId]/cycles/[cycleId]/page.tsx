import { CycleWorkItem } from "@/components/features/cycles/CycleWorkItem";

interface ProjectCyclePageProps {
  params: Promise<{
    cycleId: string;
  }>;
}

export default async function ProjectCyclePage({
  params,
}: ProjectCyclePageProps) {
  const { cycleId } = await params;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <CycleWorkItem cycleId={cycleId} />
      </div>
    </div>
  );
}
