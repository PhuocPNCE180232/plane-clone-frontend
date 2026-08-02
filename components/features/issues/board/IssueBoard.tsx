"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { toast } from "sonner";

import { updateIssue } from "@/lib/services/issue.service";

import type { Issue } from "@/types";

import BoardColumn from "./BoardColumn";

interface Props {
  issues: Issue[];
  reload: () => void;
}

export default function IssueBoard({
  issues,
  reload,
}: Props) {
  const states: Issue["state"][] = [
    "Backlog",
    "Todo",
    "In Progress",
    "Done",
    "Cancelled",
  ];

  const handleDragEnd = async (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    if (!over) return;

    const issueId = String(active.id);
    const overId = String(over.id);

    const issue = issues.find(
      (i) => i.id === issueId
    );

    if (!issue) return;

    const newState =
      states.find((state) => state === overId) ??
      issues.find((issue) => issue.id === overId)?.state;

    if (!newState) return;

    if (issue.state === newState) return;

    try {
      await updateIssue(issueId, {
        state: newState,
      });

      toast.success("Issue updated");

      reload();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4 mt-6">
        {states.map((state) => {
          const stateIssues = issues.filter(
            (i) => i.state === state
          );

          return (
            <SortableContext
              key={state}
              items={stateIssues.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <BoardColumn
                title={state}
                issues={stateIssues}
              />
            </SortableContext>
          );
        })}
      </div>
    </DndContext>
  );
}
