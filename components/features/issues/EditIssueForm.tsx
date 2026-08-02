"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateIssue } from "@/lib/services/issue.service";
import { getProjects } from "@/lib/services/project.service";
import { getModules } from "@/lib/services/module.service";
import { getCycles } from "@/lib/services/cycle.service";
import { userService } from "@/lib/services/user.service";
import type { Issue } from "@/types";

interface EditIssueFormProps {
  issue: Issue;
  onClose: () => void;
  onUpdated: () => void;
}

export const EditIssueForm = ({
  issue,
  onClose,
  onUpdated,
}: EditIssueFormProps) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [priority, setPriority] = useState(issue.priority);
  const [state, setState] = useState(issue.state);

  const [projectId, setProjectId] = useState(issue.project_id);
  const [assigneeId, setAssigneeId] = useState(issue.assignee_id ?? "");
  const [moduleId, setModuleId] = useState(issue.module_id ?? "");
  const [cycleId, setCycleId] = useState(issue.cycle_id ?? "");
  const [labels, setLabels] = useState(
    issue.labels?.join(", ") ?? ""
  );
  const [startDate, setStartDate] = useState(
    issue.start_date ?? ""
  );
  const [dueDate, setDueDate] = useState(
    issue.due_date ?? ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // States chứa dữ liệu danh sách động
  const [projects, setProjects] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, moduleData, cycleData, userData] =
          await Promise.all([
            getProjects(),
            getModules(),
            getCycles(),
            userService.getUsers(),
          ]);

        setProjects(projectData);
        setModules(moduleData);
        setCycles(cycleData);
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await updateIssue(issue.id, {
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

      toast.success("Issue updated successfully!");

      onUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update issue!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-[500px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-semibold">
          Edit Issue
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
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
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
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
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
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
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
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
              disabled={isSubmitting}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={!title.trim() || isSubmitting}
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};