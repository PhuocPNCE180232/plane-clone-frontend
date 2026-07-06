"use client";

import React, { useState } from "react";
import { Settings, Users, Link2, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema, UpdateWorkspaceInput } from "@/lib/validations/workspace";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "members", label: "Members", icon: Users },
  { id: "integrations", label: "Integrations", icon: Link2 },
];

export const WorkspaceSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: "Acme Corp",
      slug: "acme-corp",
    },
  });

  const onSubmit = async (data: UpdateWorkspaceInput) => {
    console.log("Updated Workspace Data:", data);
    alert("Cập nhật workspace thành công (Mock)!");
  };

  return (
    <div className="flex h-full flex-col md:flex-row gap-6 p-6 max-w-6xl mx-auto">
      {/* Sidebar Tabs */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Workspace Settings
        </h2>
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[500px]">
        {activeTab === "general" && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Settings Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workspace Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    AC
                  </div>
                  <button type="button" className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Upload new
                  </button>
                  <button type="button" className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-transparent rounded-md hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace URL
                </label>
                <div className="flex shadow-sm rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    plane.so/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register("slug")}
                  />
                </div>
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Update Workspace
                </button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 border-t border-red-200 pt-8">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-500 mb-4">
                Deleting a workspace is irreversible and will delete all associated projects, issues, and settings.
              </p>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                onClick={() => {
                   if (confirm("Are you ABSOLUTELY sure you want to delete this workspace?")) {
                       alert("Workspace deleted (Mock)");
                   }
                }}
              >
                <LogOut className="h-4 w-4" />
                Delete Workspace
              </button>
            </div>
          </div>
        )}

        {activeTab !== "general" && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Settings className="h-12 w-12 text-gray-300 mb-4" />
            <p>This settings page is under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
};
