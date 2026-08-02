"use client";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

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

const BOARD_STATES: Issue["state"][] = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
];

const getTargetState = (
  overId: string,
  issues: Issue[],
): Issue["state"] | null => {
  if (BOARD_STATES.includes(overId as Issue["state"])) {
    return overId as Issue["state"];
  }

  const overIssue = issues.find((issue) => issue.id === overId);

  return overIssue?.state ?? null;
};

export default function IssueBoard({
  issues,
  reload,
}: Props) {
  const handleDragEnd = async (
    event: DragEndEvent,
  ) => {
    const { active, over } = event;

    if (!over) return;

    const issueId = String(active.id);
    const overId = String(over.id);

    const issue = issues.find(
      (item) => item.id === issueId,
    );

    if (!issue) return;

    const newState = getTargetState(overId, issues);

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
      <div className="mt-6 grid grid-cols-4 gap-4">
        {BOARD_STATES.map((state) => {
          const stateIssues = issues.filter(
            (issue) => issue.state === state,
          );

          return (
            <SortableContext
              key={state}
              items={stateIssues.map((issue) => issue.id)}
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