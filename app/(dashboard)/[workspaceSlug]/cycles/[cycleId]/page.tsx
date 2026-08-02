import { CycleWorkItem } from "@/components/features/cycles/CycleWorkItem";

interface PageProps {
  params: {
    workspaceSlug: string;
    cycleId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <CycleWorkItem cycleId={params.cycleId} />
      </div>
    </div>
  );
}
