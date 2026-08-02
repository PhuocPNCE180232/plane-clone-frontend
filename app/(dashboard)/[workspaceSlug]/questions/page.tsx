import { QuestionPage } from "@/components/features/questions/QuestionPage";

interface QuestionRoutePageProps {
  params: Promise<{
    workspaceSlug: string;
  }>;
}

export default async function QuestionRoutePage({
  params,
}: QuestionRoutePageProps) {
  const { workspaceSlug } = await params;

  return <QuestionPage workspaceSlug={workspaceSlug} />;
}
