"use client";

import { Loader2, CircleHelp } from "lucide-react";
import { useQuestions } from "@/hooks/use-questions";
import { QuestionCard } from "./QuestionCard";

interface QuestionListProps {
  workspaceId?: string;
  searchQuery: string;
}

export const QuestionList = ({ workspaceId, searchQuery }: QuestionListProps) => {
  const { data: questions, isLoading } = useQuestions(workspaceId);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── No questions at all ──────────────────────────────────────────────────
  if (!questions || questions.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <CircleHelp className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mb-1 text-sm font-semibold text-gray-700">
            No questions yet
          </h2>
          <p className="max-w-xs text-xs leading-relaxed text-gray-400">
            Be the first to ask a question to your workspace.
          </p>
        </div>
      </div>
    );
  }

  // ── Client-side search filter ───────────────────────────────────────────
  const lowerQuery = (searchQuery || "").trim().toLowerCase();

  const filtered = questions.filter((q) => {
    if (!q) return false;
    if (!lowerQuery) return true;

    const title       = (q.title || "").toLowerCase();
    const description = (q.description || "").toLowerCase();
    const author      = (q.author || "").toLowerCase();

    return (
      title.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      author.includes(lowerQuery)
    );
  });

  // ── Filtered empty state ─────────────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CircleHelp className="mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-400">
          No questions match your search.
        </p>
      </div>
    );
  }

  // Newest first — sort by created_at timestamp descending
  const sortedQuestions = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col gap-4">
      {sortedQuestions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
};
