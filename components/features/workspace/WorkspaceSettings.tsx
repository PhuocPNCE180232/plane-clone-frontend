"use client";

import { useParams } from "next/navigation";

export const WorkspaceSettings = () => {
  const params = useParams();
  const slug = (params?.workspaceSlug as string) ?? "workspaceSlug";

  return (
    <div className="mx-auto max-w-4xl py-8 px-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Workspace Settings</h1>

      {/* General Settings Section */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4">General</h2>
        
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="mb-5 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                defaultValue="Plane Clone"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
              />
            </div>
            
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Workspace URL
              </label>
              <div className="flex w-full overflow-hidden rounded-md border border-gray-300 focus-within:border-[#3f76ff] focus-within:ring-1 focus-within:ring-[#3f76ff]">
                <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 border-r border-gray-300">
                  plane.so/
                </span>
                <input
                  type="text"
                  defaultValue={slug}
                  className="flex-1 px-3 py-2 text-sm text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button className="rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors">
              Update settings
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone Section */}
      <section>
        <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
        
        <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Delete Workspace</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                The workspace will be permanently deleted, including its projects, issues, and settings. This action is irreversible.
              </p>
            </div>
            <button className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors">
              Delete workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
