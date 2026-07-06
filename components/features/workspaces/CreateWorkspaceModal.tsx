"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema, CreateWorkspaceInput } from "@/lib/validations/workspace";
import { Modal } from "@/components/ui/Modal";
import { UploadCloud } from "lucide-react";

type CreateWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateWorkspaceModal = ({ isOpen, onClose }: CreateWorkspaceModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug from name
  React.useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: CreateWorkspaceInput) => {
    console.log("Workspace Data:", data);
    alert("Tạo workspace thành công (Mock)!");
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Logo Upload Placeholder */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-6 group hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer">
          <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-gray-500 mb-2" />
          <span className="text-sm font-medium text-gray-600">Upload Workspace Logo</span>
          <span className="text-xs text-gray-400">JPG, PNG, SVG up to 2MB</span>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-1">
            Workspace Name <span className="text-red-500">*</span>
          </label>
          <input
            id="workspace-name"
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Acme Corp"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Slug Field */}
        <div>
          <label htmlFor="workspace-slug" className="block text-sm font-medium text-gray-700 mb-1">
            Workspace URL <span className="text-red-500">*</span>
          </label>
          <div className="flex shadow-sm rounded-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              plane.so/
            </span>
            <input
              id="workspace-slug"
              type="text"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="acme-corp"
              {...register("slug")}
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Create Workspace
          </button>
        </div>
      </form>
    </Modal>
  );
};
