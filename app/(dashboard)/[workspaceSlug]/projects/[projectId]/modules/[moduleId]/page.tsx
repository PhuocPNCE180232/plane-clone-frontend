import { ModuleWorkItem } from "@/components/features/modules/ModuleWorkItem";

interface ProjectModulePageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function ProjectModulePage({
  params,
}: ProjectModulePageProps) {
  const { moduleId } = await params;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <ModuleWorkItem moduleId={moduleId} />
      </div>
    </div>
  );
}
