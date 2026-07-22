"use client";

import { useProjects } from "@/hooks/use-projects";
import { useParams, useRouter } from "next/navigation";
import { 
  BarChart2, 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  Settings, 
  ArrowRight,
  Loader2,
  Globe,
  Lock,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/hooks/use-app-store";
import { useEffect } from "react";

export const ProjectOverview = () => {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.workspaceSlug as string) ?? "";
  const projectId = (params?.projectId as string) ?? "";
  
  const { data: projects, isLoading } = useProjects();
  const { setProject, activeWorkspaceId } = useAppStore();
  
  const project = projects?.find((p) => p.id === projectId);

  // Auto-set the active project when visiting the overview
  useEffect(() => {
    if (project && activeWorkspaceId) {
      setProject(project.id);
    }
  }, [project, setProject, activeWorkspaceId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f76ff]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          <CircleDashed className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-900">Project not found</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          The project you are looking for does not exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => router.push(`/${slug}/projects`)}
          className="mt-6 rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // Dummy stats for the UI
  const stats = [
    { label: "To Do", count: 12, icon: CircleDashed, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "In Progress", count: 5, icon: Clock, color: "text-amber-500", bg: "bg-amber-100" },
    { label: "Done", count: 28, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
  ];

  return (
    <div className="mx-auto max-w-5xl py-8 px-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
            <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 uppercase tracking-wider">
              {project.identifier}
            </span>
            {project.network === "private" ? (
              <span className="flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                <Lock className="h-3 w-3" /> Private
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#3f76ff]">
                <Globe className="h-3 w-3" /> Public
              </span>
            )}
            {project.status === "archived" && (
              <span className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                Archived
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 max-w-2xl">
            {project.description || "No description provided for this project."}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/${slug}/projects/${projectId}/settings`}
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href={`/${slug}/issues`}
            className="flex items-center gap-2 rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors shadow-sm"
          >
            Go to Issues
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Stats */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-gray-500" />
              <h2 className="font-medium text-gray-900">Issue Overview</h2>
            </div>
            <div className="p-5 grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`rounded-md p-1.5 ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{stat.count}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity (Dummy) */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-gray-500" />
              <h2 className="font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-gray-50 p-3 mb-3 border border-gray-100">
                  <Clock className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-xs text-gray-500">Activity will appear here once you start creating and updating issues.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Project Details */}
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-medium text-gray-900">Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Created At</span>
                <span className="text-sm text-gray-900">
                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Just now"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Identifier</span>
                <span className="text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">
                  {project.identifier}
                </span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Network</span>
                <span className="text-sm text-gray-900 capitalize">{project.network || "Public"}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
