"use client";

import { toast } from "sonner";
import { useState } from "react";
import { createIssue } from "@/lib/services/issue.service";

interface IssueFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export const IssueForm = ({ onClose, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [state, setState] = useState("Todo");

  const [projectId, setProjectId] = useState("p1");
  const [assigneeId, setAssigneeId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [labels, setLabels] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = async () => {
    try {
      await createIssue({
        project_id: projectId,
        title,
        description,
        state,
        priority,
        assignee_id: assigneeId || null,
        module_id: moduleId || null,
        cycle_id: cycleId || null,
        labels: labels
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        start_date: startDate || null,
        due_date: dueDate || null,
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
      <div className="w-[500px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-semibold">
          Create Issue
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Project
            </label>

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="p1">Plane Clone</option>
              <option value="p2">Backend API</option>
              <option value="p3">Mobile App</option>
            </select>
          </div>

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
              onChange={(e) => setPriority(e.target.value)}
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
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option>Todo</option>
              <option>Backlog</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Assignee
            </label>

            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">None</option>
              <option value="u1">Phước</option>
              <option value="u2">Điền</option>
              <option value="u3">Danh</option>
              <option value="u4">Nhân</option>
              <option value="u5">Nghĩa</option>
              <option value="u6">Trâm</option>
              <option value="u7">Đức</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Module
            </label>

            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">None</option>
              <option value="m1">Auth</option>
              <option value="m2">Core Features</option>
              <option value="m3">UI Components</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Cycle
            </label>

            <select
              value={cycleId}
              onChange={(e) => setCycleId(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">None</option>
              <option value="c1">Cycle 1</option>
              <option value="c2">Cycle 2</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Labels
            </label>

            <input
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="bug, frontend, urgent"
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded border p-2"
            />
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