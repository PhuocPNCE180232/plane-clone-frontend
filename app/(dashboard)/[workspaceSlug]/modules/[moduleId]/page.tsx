import { ModuleWorkItem } from "@/components/features/modules/ModuleWorkItem";

interface PageProps {
  params: {
    workspaceSlug: string;
    moduleId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <ModuleWorkItem moduleId={params.moduleId} />
      </div>
    </div>
  );
}
