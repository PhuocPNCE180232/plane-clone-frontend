"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Issue } from "@/types";

interface Props {
  issue: Issue;
}

export default function BoardCard({
  issue,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        rounded-lg
        bg-white
        border
        p-4
        shadow-sm
        cursor-grab
        active:cursor-grabbing
      "
    >
      <div className="font-medium">
        {issue.title}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {issue.priority}
      </div>
    </div>
  );
}