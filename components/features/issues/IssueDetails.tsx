import { MoreHorizontal } from "lucide-react";
import { IssuePriorityBadge } from "./IssuePriorityBadge";
import { IssueStatusBadge } from "./IssueStatusBadge";

export const IssueDetails = () => {
  return (
    <div>
      {/* Header with badges and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IssueStatusBadge state="In Progress" />
          <IssuePriorityBadge priority="Urgent" />
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-semibold text-gray-900">
        Implement user authentication
      </h1>

      {/* Description */}
      <div className="prose prose-sm mt-6 max-w-none text-gray-800 prose-p:my-0 prose-p:leading-relaxed">
        <p>
          As a user, I want to be able to sign up and log in to the application
          so that I can access my personalized content.
        </p>
        <p>
          <strong>Acceptance Criteria:</strong>
        </p>
        <ul>
          <li>User can sign up with email and password.</li>
          <li>User can log in with email and password.</li>
          <li>User can log out.</li>
          <li>Implement session management.</li>
        </ul>
      </div>
    </div>
  );
};