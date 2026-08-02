import { QuestionDetail } from "@/components/features/questions/QuestionDetail";

interface QuestionDetailRoutePageProps {
  params: Promise<{
    workspaceSlug: string;
    questionId: string;
  }>;
}

export default async function QuestionDetailRoutePage({
  params,
}: QuestionDetailRoutePageProps) {
  const { workspaceSlug, questionId } = await params;

  return <QuestionDetail workspaceSlug={workspaceSlug} questionId={questionId} />;
}
