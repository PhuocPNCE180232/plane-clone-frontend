const mockComments = [
  {
    id: "comment-1",
    user: {
      name: "Olivia Rhye",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    createdAt: "2 hours ago",
    content:
      "This looks good. What's the timeline for the backend implementation? We should align on the API contract before moving forward.",
  },
  {
    id: "comment-2",
    user: {
      name: "Phoenix Baker",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    createdAt: "1 hour ago",
    content:
      "I've pushed a draft PR with the initial API spec. Please take a look and provide feedback.",
  },
];

export const CommentSection = () => {
  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">Comments</h2>

      {/* New Comment Form */}
      <div className="mt-4 flex gap-4">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-300" title="You" />
        <div className="flex-1">
          <div className="rounded-lg border border-gray-300 bg-white">
            <textarea
              className="w-full resize-none rounded-t-lg border-0 bg-transparent p-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
              placeholder="Leave a comment..."
              rows={3}
            />
            <div className="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-3 py-2">
              <button
                type="button"
                className="rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500"
                disabled
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Comments */}
      <div className="mt-6 space-y-6">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {comment.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {comment.createdAt}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};