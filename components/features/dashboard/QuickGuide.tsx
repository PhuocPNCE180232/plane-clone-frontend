"use client";

import {
  FolderPlus,
  Users,
  Settings,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreateProjectModal } from "../projects/CreateProjectModal";

const guides = [
  {
    icon: <FolderPlus className="h-5 w-5" />,
    title: "Create Project",
    description: "Most things start with a project.",
    action: "create_project",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Invite Team",
    description: "Build together with coworkers.",
    action: "invite_team",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: "Setup Workspace",
    description: "Configure your workspace.",
    action: "setup_workspace",
  },
  {
    icon: <UserCircle className="h-5 w-5" />,
    title: "Make Plane Yours",
    description: "Customize your profile.",
    action: "customize_profile",
  },
];

export const QuickGuide = () => {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const handleAction = (action: string) => {
    if (action === "create_project") {
      setIsCreateProjectModalOpen(true);
    } else if (action === "setup_workspace") {
      const slug = params?.workspaceSlug;
      if (slug) router.push(`/${slug}/settings`);
    }
  };

  return (
    <section className="mb-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Quick Guide
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {guides.map((item) => (
          <div
            key={item.title}
            onClick={() => handleAction(item.action)}
            className="
              flex items-start gap-3
              rounded-xl border border-gray-200 bg-white
              p-4 shadow-sm
              cursor-pointer
              hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
              transition-all duration-200
            "
          >
            {/* Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              {item.icon}
            </div>

            {/* Text */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)} 
      />
    </section>
  );
};