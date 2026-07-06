"use client";

import React, { useState } from "react";
import { Plus, Tags, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLabelSchema, CreateLabelInput } from "@/lib/validations/project";

const MOCK_LABELS = [
  { id: 1, name: "Bug", color: "#ef4444" },
  { id: 2, name: "Feature", color: "#3b82f6" },
  { id: 3, name: "Improvement", color: "#f59e0b" },
];

export const LabelsSettings = () => {
  const [labels, setLabels] = useState(MOCK_LABELS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateLabelInput>({
    resolver: zodResolver(createLabelSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  const onSubmit = async (data: CreateLabelInput) => {
    console.log("New Label:", data);
    setLabels([...labels, { id: Date.now(), ...data }]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Labels</h3>
          <p className="text-sm text-gray-500">Manage issue labels for this project.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#3f76ff] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2d63e8] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Label
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 bg-white"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-sm font-medium text-gray-900">{label.name}</span>
            </div>
            <button
              onClick={() => handleDelete(label.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Label">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label Name</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              className="h-10 w-full rounded-md border border-gray-300 p-1 cursor-pointer"
              {...register("color")}
            />
            {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Create Label
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
