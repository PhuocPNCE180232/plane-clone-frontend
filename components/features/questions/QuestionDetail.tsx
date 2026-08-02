"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Trash2,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { QuestionAnswer } from "@/types";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAppStore } from "@/hooks/use-app-store";
import {
  useQuestion,
  useDeleteQuestionMutation,
  useAddAnswerMutation,
  useDeleteAnswerMutation,
} from "@/hooks/use-questions";
import { confirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";

export const QuestionDetail = () => {
  const params        = useParams();
  const router        = useRouter();
  const questionId    = (params?.questionId as string) ?? "";
  const workspaceSlug = (params?.workspaceSlug as string) ?? "workspaceSlug";

  const { data: workspaces } = useWorkspaces();
  const activeWorkspaceId    = useAppStore((state) => state.activeWorkspaceId);
  const activeWorkspace      = workspaces?.find((w) => w.id === activeWorkspaceId);

  const [answerText, setAnswerText] = useState("");

  const { data: question, isLoading } = useQuestion(questionId);

  const { mutate: handleDeleteQuestion, isPending: isDeletingQuestion } =
    useDeleteQuestionMutation();
  const { mutate: handleAddAnswer, isPending: isAddingAnswer } =
    useAddAnswerMutation();
  const { mutate: handleDeleteAnswer } = useDeleteAnswerMutation();

  // ── Handlers ─────────────────────────────────────────────────────────────

  const onDeleteQuestion = async () => {
    if (!question) return;

    const ok = await confirm({
      title:       "Delete Question",
      description: `"${question.title}" will be permanently deleted. This action cannot be undone.`,
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDeleteQuestion(question.id, {
      onSuccess: () => {
        toast.success("Question deleted successfully.");
        router.push(`/${workspaceSlug}/questions`);
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

  const onSubmitAnswer = () => {
    if (!answerText.trim() || !questionId) return;

    handleAddAnswer(
      { questionId, data: { content: answerText.trim() } },
      {
        onSuccess: () => {
          setAnswerText("");
          toast.success("Answer posted successfully.");
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to post answer. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  const onDeleteAnswer = async (answerId: string) => {
    const ok = await confirm({
      title:       "Delete Answer",
      description: "Are you sure you want to delete this answer?",
      confirmText: "Delete",
      cancelText:  "Cancel",
      variant:     "danger",
    });

    if (!ok) return;

    handleDeleteAnswer(
      { questionId, answerId },
      {
        onSuccess: () => {
          toast.success("Answer deleted.");
        },
        onError: (e) => {
          const message =
            (e as { response?: { data?: { error?: string } } })
              ?.response?.data?.error ??
            "Failed to delete answer. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (!question) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-base font-semibold text-gray-800">
          Question not found
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          It may have been deleted or does not exist.
        </p>
        <Link
          href={`/${workspaceSlug}/questions`}
          className="mt-4 inline-block rounded-md bg-[#3f76ff] px-4 py-2 text-xs font-medium text-white hover:bg-[#2d63e8] transition-colors"
        >
          Back to Questions
        </Link>
      </div>
    );
  }

  let relativeTime = "recently";
  try {
    const d = new Date(question.created_at);
    if (!isNaN(d.getTime())) {
      relativeTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    relativeTime = "recently";
  }

  const answersList = question.answers ?? [];

  return (
    <div className="max-w-4xl">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          href={`/${workspaceSlug}`}
          className="transition-colors hover:text-gray-900"
        >
          {activeWorkspace?.name || "Workspace"}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <Link
          href={`/${workspaceSlug}/questions`}
          className="transition-colors hover:text-gray-900"
        >
          Questions
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-medium text-gray-900 truncate max-w-xs">
          {question.title}
        </span>
      </div>

      {/* ── Main Question Card ────────────────────────────────────────────── */}
      <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={question.avatar}
              alt={question.author}
              className="h-9 w-9 rounded-full object-cover border border-gray-200 shrink-0"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-900 leading-tight">
                {question.author}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{relativeTime}</p>
            </div>
          </div>

          <button
            type="button"
            title="Delete question"
            onClick={onDeleteQuestion}
            disabled={isDeletingQuestion}
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

        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {question.title}
          </h1>
          {question.description && (
            <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Answers Section Header ───────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-gray-500" />
        <h2 className="text-base font-semibold text-gray-900">
          Answers ({answersList.length})
        </h2>
      </div>

      {/* ── Answers List ─────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        {answersList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <p className="text-xs text-gray-400">No answers yet.</p>
          </div>
        ) : (
          answersList.map((answer: QuestionAnswer) => (
            <AnswerRow
              key={answer.id}
              answer={answer}
              onDelete={() => onDeleteAnswer(answer.id)}
            />
          ))
        )}
      </div>

      {/* ── Add Answer Input Box ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-xs font-semibold text-gray-700">
          Your Answer
        </h3>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer..."
          rows={3}
          className="
            w-full resize-none rounded-md border border-gray-200 p-3
            text-sm text-gray-900 placeholder-gray-400
            focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]
          "
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSubmitAnswer}
            disabled={isAddingAnswer || !answerText.trim()}
            className="
              flex items-center gap-1.5 rounded-md bg-[#3f76ff] px-4 py-2
              text-xs font-medium text-white
              hover:bg-[#2d63e8] transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {isAddingAnswer ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Answer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Answer Row Sub-component ────────────────────────────────────────────────

interface AnswerRowProps {
  answer: QuestionAnswer;
  onDelete: () => void;
}

const AnswerRow = ({ answer, onDelete }: AnswerRowProps) => {
  let answerTime = "recently";
  try {
    const d = new Date(answer.created_at);
    if (!isNaN(d.getTime())) {
      answerTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    answerTime = "recently";
  }

  return (
    <div className="group/ans flex items-start justify-between gap-3 rounded-xl bg-gray-50/70 p-4 border border-gray-100 transition-all hover:border-gray-200 hover:bg-gray-50">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <img
          src={answer.avatar}
          alt={answer.author}
          className="h-7 w-7 rounded-full object-cover border border-gray-200 shrink-0 mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">
              {answer.author}
            </span>
            <span className="text-[11px] text-gray-400">{answerTime}</span>
          </div>
          <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {answer.content}
          </p>
        </div>
      </div>

      <button
        type="button"
        title="Delete answer"
        onClick={onDelete}
        className="
          rounded p-1 text-gray-400
          opacity-0 group-hover/ans:opacity-100
          transition-all duration-150
          hover:bg-gray-200 hover:text-red-500
          shrink-0
        "
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
