"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createIssue } from "@/lib/services/issue.service";
import { getModules, type Module } from "@/lib/services/module.service";
import { getCycles, type Cycle } from "@/lib/services/cycle.service";
import { userService } from "@/lib/services/user.service";
import type { User } from "@/types";

type IssueState = "Backlog" | "Todo" | "In Progress" | "Done" | "Cancelled";
type IssuePriority = "Urgent" | "High" | "Medium" | "Low" | "None";

interface IssueFormProps {
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}

export const IssueForm = ({ projectId, onClose, onCreated }: IssueFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("Low");
  const [state, setState] = useState<IssueState>("Todo");

  const [assigneeId, setAssigneeId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [labels, setLabels] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [relationshipProjectId, setRelationshipProjectId] = useState(projectId);

  if (relationshipProjectId !== projectId) {
    setRelationshipProjectId(projectId);
    setModuleId("");
    setCycleId("");
  }

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        const [moduleData, cycleData, userData] = await Promise.all([
          getModules(projectId),
          getCycles(projectId),
          userService.getUsers(),
        ]);

        if (cancelled) return;

        setModules(moduleData.filter((module) => module.project_id === projectId));
        setCycles(cycleData.filter((cycle) => cycle.project_id === projectId));
        setUsers(userData);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load issue options:", error);
        }
      }
    };

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

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
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
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
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
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
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </option>
              ))}
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
