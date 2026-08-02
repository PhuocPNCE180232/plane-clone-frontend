"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PagesHeader } from "./PagesHeader";
import { PageList } from "./PageList";

export const PagesPage = () => {
  const params = useParams();
  const slug       = (params?.workspaceSlug as string) ?? "";
  const projectId  = (params?.projectId     as string) ?? "";

  // searchQuery owned here — same pattern as MembersPage owning searchQuery
  // and passing it to MembersHeader + MemberTable.
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <PagesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <PageList
        projectId={projectId}
        workspaceSlug={slug}
        searchQuery={searchQuery}
      />
    </>
  );
};
