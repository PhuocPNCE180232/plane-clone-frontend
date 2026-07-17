import { ChevronRight } from "lucide-react";
import { IssueDetails } from "./IssueDetails";
import { CommentSection } from "./CommentSection";

interface IssueDetailPageProps {
  issueId: string;
}

export const IssueDetailPage = ({
  issueId,
}: IssueDetailPageProps) => {
  return (
    <>
      <div className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Plane Clone
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />

        <span className="cursor-pointer transition-colors hover:text-gray-900">
          Work Items
        </span>

        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />

        <span className="font-medium text-gray-900">
          {issueId}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <IssueDetails />
          <CommentSection issueId={issueId} />
        </div>

        <div className="col-span-1" />
      </div>
    </>
  );
};