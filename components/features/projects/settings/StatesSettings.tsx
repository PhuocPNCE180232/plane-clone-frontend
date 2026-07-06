"use client";

import React, { useState } from "react";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStateSchema, CreateStateInput } from "@/lib/validations/project";

const MOCK_STATES = [
  { id: 1, name: "Backlog", color: "#6b7280", group: "Backlog" },
  { id: 2, name: "Todo", color: "#3b82f6", group: "Unstarted" },
  { id: 3, name: "In Progress", color: "#f59e0b", group: "Started" },
  { id: 4, name: "Done", color: "#10b981", group: "Completed" },
  { id: 5, name: "Canceled", color: "#ef4444", group: "Canceled" },
];

export const StatesSettings = () => {
  const [states, setStates] = useState(MOCK_STATES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateStateInput>({
    resolver: zodResolver(createStateSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6",
      group: "Backlog",
    },
  });

  const onSubmit = async (data: CreateStateInput) => {
    console.log("New State:", data);
    setStates([...states, { id: Date.now(), ...data }]);
    reset();
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setStates(states.filter(s => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">States</h3>
          <p className="text-sm text-gray-500">Manage issue states and their workflow groups.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-[#3f76ff] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2d63e8] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New State
        </button>
      </div>

      <div className="space-y-3">
        {states.map((state) => (
          <div
            key={state.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 bg-white"
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: state.color }}
              />
              <span className="text-sm font-medium text-gray-900">{state.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {state.group}
              </span>
              <button
                onClick={() => handleDelete(state.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New State">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State Name</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("group")}
            >
              <option value="Backlog">Backlog</option>
              <option value="Unstarted">Unstarted</option>
              <option value="Started">Started</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
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
              Create State
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
