"use client";

import {
  AlertCircle,
  FileText,
  Users,
  MessageCircle,
  RotateCw,
  Box,
  Folder,
  Bell,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/types";
import {
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} from "@/hooks/use-inbox";
import { toast } from "@/hooks/use-toast";

// ─── Icon + colour map ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  Notification["type"],
  { Icon: React.ElementType; bg: string; text: string }
> = {
  issue:   { Icon: AlertCircle,   bg: "bg-orange-50",  text: "text-orange-500"  },
  page:    { Icon: FileText,      bg: "bg-blue-50",    text: "text-blue-500"    },
  member:  { Icon: Users,         bg: "bg-purple-50",  text: "text-purple-500"  },
  comment: { Icon: MessageCircle, bg: "bg-green-50",   text: "text-green-500"   },
  cycle:   { Icon: RotateCw,      bg: "bg-teal-50",    text: "text-teal-500"    },
  module:  { Icon: Box,           bg: "bg-indigo-50",  text: "text-indigo-500"  },
  project: { Icon: Folder,        bg: "bg-yellow-50",  text: "text-yellow-600"  },
};

// Bell is the fallback for any runtime type value not covered by the union.
const FALLBACK_CONFIG = { Icon: Bell, bg: "bg-gray-100", text: "text-gray-500" };

// ─── Component ──────────────────────────────────────────────────────────────

interface InboxItemProps {
  notification: Notification;
}

export const InboxItem = ({ notification }: InboxItemProps) => {
  const config = TYPE_CONFIG[notification.type] ?? FALLBACK_CONFIG;
  const { Icon, bg, text } = config;

  const { mutate: markRead,    isPending: isMarking  } = useMarkAsReadMutation();
  const { mutate: deleteNotif, isPending: isDeleting } = useDeleteNotificationMutation();

  let relativeTime = "recently";
  try {
    const d = new Date(notification.created_at);
    if (!isNaN(d.getTime())) {
      relativeTime = formatDistanceToNow(d, { addSuffix: true });
    }
  } catch {
    relativeTime = "recently";
  }

  // ── Handlers — inline onSuccess/onError (MemberRow / PageRow pattern) ──

  const onMarkRead = () => {
    markRead(notification.id, {
      onSuccess: () => toast.success("Notification marked as read."),
      onError:   () => toast.error("Failed to mark as read."),
    });
  };

  const onDelete = () => {
    deleteNotif(notification.id, {
      onSuccess: () => toast.success("Notification deleted."),
      onError:   () => toast.error("Failed to delete notification."),
    });
  };

  return (
    // `group` enables group-hover:opacity-100 on child action buttons —
    // identical to the MemberRow / PageRow pattern.
    <div
      className={[
        "group flex items-center gap-4 px-4 py-4",
        "border-b border-gray-100 last:border-b-0",
        "transition-all duration-150 hover:bg-gray-100",
        notification.is_read
          ? "bg-gray-50 border-l-4 border-l-transparent"
          : "bg-white  border-l-4 border-l-[#3f76ff]",
      ].join(" ")}
    >
      {/* Type icon — coloured rounded badge */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-md p-2 ${bg}`}
      >
        <Icon className={`h-4 w-4 ${text}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`truncate text-sm ${
              notification.is_read
                ? "font-normal text-gray-600"
                : "font-semibold text-gray-900"
            }`}
          >
            {notification.title}
          </p>
          {/* Blue unread dot — only when unread */}
          {!notification.is_read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#3f76ff]" />
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {notification.description}
        </p>
      </div>

      {/* Right side: relative time + hover actions */}
      <div className="flex shrink-0 items-center gap-1">
        <span className="mr-2 whitespace-nowrap text-xs text-gray-400">
          {relativeTime}
        </span>

        {/* Mark as read — only for unread notifications; hidden until hovered */}
        {!notification.is_read && (
          <button
            type="button"
            title="Mark as read"
            onClick={onMarkRead}
            disabled={isMarking}
            className="
              rounded p-1
              text-gray-400
              opacity-0 group-hover:opacity-100
              transition-all duration-150
              hover:bg-white hover:text-[#3f76ff]
              disabled:cursor-not-allowed disabled:opacity-30
            "
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Delete — always present, hidden until hovered */}
        <button
          type="button"
          title="Delete notification"
          onClick={onDelete}
          disabled={isDeleting}
          className="
            rounded p-1
            text-gray-400
            opacity-0 group-hover:opacity-100
            transition-all duration-150
            hover:bg-white hover:text-red-500
            disabled:cursor-not-allowed disabled:opacity-30
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
