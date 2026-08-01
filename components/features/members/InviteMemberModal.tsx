"use client";

import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useInviteMemberMutation } from "@/hooks/use-members";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";

type InviteRow = {
  id: string;
  email: string;
  role: string;
};

const createEmptyRow = (): InviteRow => ({
  id: Math.random().toString(36).substring(2, 9),
  email: "",
  role: "member",
});

type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const InviteMemberModal = ({ isOpen, onClose }: InviteMemberModalProps) => {
  const [rows, setRows] = useState<InviteRow[]>([createEmptyRow()]);
  const [isSending, setIsSending] = useState(false);

  const { activeWorkspaceId } = useAppStore();
  const { mutateAsync } = useInviteMemberMutation();

  // ── Row helpers ──────────────────────────────────────────────────────────

  const updateRow = (id: string, field: keyof InviteRow, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => setRows((prev) => [...prev, createEmptyRow()]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((row) => row.id !== id));

  // ── Submit — one mutateAsync call per valid row (sequential) ─────────────
  // Reuses the existing useInviteMemberMutation hook unchanged.
  // mutateAsync is used so we can await each call and collect results.

  const onSubmit = async () => {
    const validRows = rows.filter((r) => r.email.trim());
    if (!validRows.length || !activeWorkspaceId) return;

    setIsSending(true);
    let successCount = 0;
    const failedEmails: string[] = [];

    for (const row of validRows) {
      try {
        await mutateAsync({
          email: row.email.trim(),
          role: row.role,
          workspace_id: activeWorkspaceId,
        });
        successCount++;
      } catch (e) {
        // Surface server message when available (e.g. duplicate email)
        const serverMsg =
          (e as { response?: { data?: { error?: string } } })
            ?.response?.data?.error;
        failedEmails.push(serverMsg ?? row.email.trim());
      }
    }

    setIsSending(false);

    if (successCount > 0) {
      toast.success(
        `${successCount} invitation${successCount > 1 ? "s" : ""} sent successfully.`
      );
    }
    if (failedEmails.length > 0) {
      toast.error(`Failed to invite: ${failedEmails.join(", ")}`);
    }

    if (successCount > 0) {
      setRows([createEmptyRow()]);
      onClose();
    }
  };

  const handleClose = () => {
    setRows([createEmptyRow()]);
    onClose();
  };

  const hasValidRow = rows.some((r) => r.email.trim());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Invite Members</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Invite teammates to collaborate in this workspace.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Column labels */}
          <div className="mb-2 flex items-center gap-2">
            <span className="flex-1 text-xs font-medium text-gray-500">Email address</span>
            <span className="w-32 shrink-0 text-xs font-medium text-gray-500">Role</span>
            {/* Spacer for remove button column */}
            {rows.length > 1 && <span className="w-7 shrink-0" />}
          </div>

          {/* Invite rows */}
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center gap-2">
                {/* Email input */}
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => updateRow(row.id, "email", e.target.value)}
                  placeholder="name@example.com"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                />

                {/* Role select */}
                <select
                  value={row.role}
                  onChange={(e) => updateRow(row.id, "role", e.target.value)}
                  className="w-32 shrink-0 rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-900 focus:border-[#3f76ff] focus:outline-none focus:ring-1 focus:ring-[#3f76ff]"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="guest">Guest</option>
                </select>

                {/* Remove row button — only shown when there are multiple rows */}
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="w-7 shrink-0 flex items-center justify-center rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors"
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add another row */}
          <button
            type="button"
            onClick={addRow}
            className="mt-3 flex items-center gap-1.5 text-sm text-[#3f76ff] hover:text-[#2d63e8] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add more
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-xl shrink-0">
          <button
            onClick={handleClose}
            disabled={isSending}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSending || !hasValidRow}
            className="flex items-center justify-center min-w-[140px] rounded-md bg-[#3f76ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d63e8] transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send invitations"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
