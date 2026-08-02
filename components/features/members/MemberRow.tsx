"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Member } from "@/types";
import { mockUsers } from "@/mocks/db";
import { useRemoveMemberMutation } from "@/hooks/use-members";
import { confirm } from "@/hooks/use-confirm";
import { toast } from "@/hooks/use-toast";

// ─── Role badge config ──────────────────────────────────────────────────────
// Same inline config-map approach as IssueStatusBadge / IssueRow module badges.

const ROLE_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  owner:  { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",   label: "Owner"  },
  admin:  { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", label: "Admin"  },
  member: { bg: "bg-gray-100",  text: "text-gray-600",   border: "border-gray-200",   label: "Member" },
  guest:  { bg: "bg-gray-50",   text: "text-gray-400",   border: "border-gray-200",   label: "Guest"  },
};

const DEFAULT_ROLE_CONFIG = ROLE_CONFIG.member;

// ─── Initials helper ────────────────────────────────────────────────────────
// Identical implementation to ProjectCard and IssueRow.

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Component ──────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: Member;
}

export const MemberRow = ({ member }: MemberRowProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Resolve the User record by matching email — same lookup pattern as IssueRow
  const user = mockUsers.find((u) => u.email === member.email) ?? null;
  const displayName = user?.name ?? member.email;
  const initials = getInitials(displayName);

  const roleConfig = ROLE_CONFIG[member.role] ?? DEFAULT_ROLE_CONFIG;

  let joinedLabel = "recently";
  try {
    const d = new Date(member.joined_at);
    if (!isNaN(d.getTime())) {
      joinedLabel = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    joinedLabel = "recently";
  }

  const { mutate: handleRemove, isPending: isRemoving } = useRemoveMemberMutation();

  // Remove handler — CycleCard pattern exactly:
  // 1. Close menu first so UI feels snappy
  // 2. Await confirm dialog (returns Promise<boolean>)
  // 3. Call mutate only if user confirmed
  const onRemove = async () => {
    setIsMenuOpen(false);
    const ok = await confirm({
      title: "Remove Member",
      description: `This will remove ${displayName} from the workspace. This action cannot be undone.`,
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (ok) {
      handleRemove(member.id, {
        onSuccess: () => {
          toast.success("Member removed successfully.");
        },
        onError: () => {
          toast.error("Failed to remove member. Please try again.");
        },
      });
    }
  };

  return (
    <div
      className="
        group
        flex items-center gap-4
        border-b border-gray-100
        px-4 py-3
        transition-colors
        hover:bg-gray-50
        last:border-b-0 last:rounded-b-xl
      "
    >
      {/* Avatar — <img> with initials fallback, matches IssueRow pattern */}
      <div className="shrink-0" title={displayName}>
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
            alt={displayName}
            className="h-8 w-8 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-500">
            {initials}
          </div>
        )}
      </div>

      {/* Name + email */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-gray-900">
          {displayName}
        </span>
        <span className="truncate text-xs text-gray-400">{member.email}</span>
      </div>

      {/* Role badge — pill style matching IssueRow module/cycle badges */}
      <div className="shrink-0">
        <span
          className={`
            inline-flex items-center
            rounded-full border px-2 py-0.5
            text-[10px] font-medium
            ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}
          `}
        >
          {roleConfig.label}
        </span>
      </div>

      {/* Joined date */}
      <div className="w-28 shrink-0 text-xs text-gray-400">
        {joinedLabel}
      </div>

      {/* Three-dot menu — CycleCard pattern. Hidden for owners (cannot be removed). */}
      {member.role !== "owner" ? (
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((v) => !v);
            }}
            className="
              rounded p-1
              text-gray-300
              opacity-0
              transition-all
              group-hover:opacity-100
              hover:bg-gray-100
              hover:text-gray-600
            "
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={isRemoving}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Preserve column alignment for owner rows */
        <span className="w-6 shrink-0" />
      )}
    </div>
  );
};
