"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Issue } from "@/types";
import BoardCard from "./BoardCard";

interface Props {
  title: string;
  issues: Issue[];
}

export default function BoardColumn({
  title,
  issues,
}: Props) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-xl bg-gray-100 p-3 min-h-[500px]"
    >
      <h2 className="mb-3 font-semibold">
        {title}
      </h2>

      <div className="space-y-2">
        {issues.map((issue) => (
          <BoardCard
            key={issue.id}
            issue={issue}
          />
        ))}
      </div>
    </div>
  );
}