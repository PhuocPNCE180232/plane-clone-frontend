"use client";

interface DeleteIssueDialogProps {
  open: boolean;
  issueTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteIssueDialog({
  open,
  issueTitle,
  onCancel,
  onConfirm,
}: DeleteIssueDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-[430px] rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center pt-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7L5 7M10 11v6M14 11v6M9 7V4h6v3m-8 0h10l-1 13H8L7 7z"
                />
              </svg>
            </div>
          </div>

          <div className="px-8 py-6 text-center">
            <h2 className="text-2xl font-bold">
              Delete issue?
            </h2>

            <p className="mt-4 text-gray-600">
              Delete issue
              <br />
              <span className="font-semibold">
                &quot;{issueTitle}&quot;
              </span>
              ?
            </p>

            <p className="mt-3 text-sm text-gray-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 border-t px-6 py-5">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border py-3 font-medium hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
