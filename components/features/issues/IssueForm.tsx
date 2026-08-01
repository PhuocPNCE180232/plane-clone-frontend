"use client";

import { toast } from "sonner";
import { useState } from "react";
import { createIssue } from "@/lib/services/issue.service";

type IssueState = "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
type IssuePriority = "Urgent" | "High" | "Medium" | "Low" | "None";

interface IssueFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export const IssueForm = ({ onClose, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("Low");
  const [state, setState] = useState<IssueState>("Todo");

  const handleCreate = async () => {
    try {
      await createIssue({
        project_id: "p1",
        title,
        description,
        state,
        priority,
        assignee_id: null,
        module_id: null,
        cycle_id: null,
      });

      toast.success("Issue created successfully!");

      onCreated();
      onClose();
    } catch (error) {
      toast.error("Failed to create issue!");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[500px] rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-semibold">
          Create Issue
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as IssuePriority)}
              className="w-full rounded border p-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              State
            </label>

            <select
              value={state}
              onChange={(e) => setState(e.target.value as IssueState)}
              className="w-full rounded border p-2"
            >
              <option>Todo</option>
              <option>Backlog</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={!title.trim()}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};