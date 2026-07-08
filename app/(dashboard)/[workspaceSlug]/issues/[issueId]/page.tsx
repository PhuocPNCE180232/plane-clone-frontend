import { IssueDetailPage } from "@/components/features/issues/IssueDetailPage";

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8">
        <IssueDetailPage />
      </div>
    </div>
  );
}