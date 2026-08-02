"use client";

import { Trash2, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Question } from "@/types";
import { useDeleteQuestionMutation } from "@/hooks/use-questions";
import { confirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const params = useParams();
  const workspaceSlug = (params?.workspaceSlug as string) ?? "workspaceSlug";

  const { mutate: handleDeleteQuestion, isPending: isDeleting } = useDeleteQuestionMutation();

  let relativeTime = "recently";
  try {
    const d = new Date(question.created_at);
    if (!isNaN(d.getTime())) {
      relativeTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    relativeTime = "recently";
  }

  const answersCount = question.answers?.length ?? 0;

  const onDeleteQuestion = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = await confirm({
      title:       "Delete Question",
      description: "Are you sure you want to delete this question? This action cannot be undone.",
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDeleteQuestion(question.id, {
      onSuccess: () => {
        toast.success("Question deleted successfully.");
      },
      onError: (e) => {
        const message =
          (e as { response?: { data?: { error?: string } } })
            ?.response?.data?.error ??
          "Failed to delete question. Please try again.";
        toast.error(message);
      },
    });
  };

  return (
    <Link
      href={`/${workspaceSlug}/questions/${question.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-gray-300 hover:shadow"
    >
      {/* ── Top row: Avatar + Author + Relative time + Delete button ───────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={question.avatar}
            alt={question.author}
            className="h-8 w-8 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900 leading-tight">
              {question.author}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{relativeTime}</p>
          </div>
        </div>

        {/* Delete action button (hover-revealed) */}
        <button
          type="button"
          title="Delete question"
          onClick={onDeleteQuestion}
          disabled={isDeleting}
          className="
            rounded p-1.5
            text-gray-400
            opacity-0 group-hover:opacity-100
            transition-all duration-150
            hover:bg-gray-100 hover:text-red-500
            disabled:cursor-not-allowed disabled:opacity-30
          "
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* ── Question Title & Description ──────────────────────────────────── */}
      <div className="mt-3">
        <h4 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-[#3f76ff] transition-colors">
          {question.title}
        </h4>
        {question.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 line-clamp-2">
            {question.description}
          </p>
        )}
      </div>

      {/* ── Footer: Answers count ─────────────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-gray-500 border-t border-gray-100 pt-3">
        <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
        <span>
          {answersCount > 0
            ? `${answersCount} ${answersCount === 1 ? "answer" : "answers"}`
            : "No answers yet"}
        </span>
      </div>
    </Link>
  );
};
