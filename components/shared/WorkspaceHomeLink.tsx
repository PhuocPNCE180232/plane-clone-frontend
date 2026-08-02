"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type WorkspaceHomeLinkProps = {
  children: ReactNode;
  className?: string;
};

export const WorkspaceHomeLink = ({
  children,
  className = "cursor-pointer transition-colors hover:text-gray-900",
}: WorkspaceHomeLinkProps) => {
  const params = useParams<{ workspaceSlug?: string }>();
  const workspaceSlug = params?.workspaceSlug;

  if (!workspaceSlug) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link href={`/${workspaceSlug}`} className={className}>
      {children}
    </Link>
  );
};
