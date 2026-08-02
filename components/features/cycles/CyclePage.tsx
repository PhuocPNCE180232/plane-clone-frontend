"use client";

import { useState } from "react";
import { CycleHeader } from "./CycleHeader";
import { CycleList } from "./CycleList";

type CycleFilterStatus = "all" | "active" | "upcoming" | "completed";

type CyclePageProps = {
  projectId: string;
};

export const CyclePage = ({ projectId }: CyclePageProps) => {
  const [filterStatus, setFilterStatus] = useState<CycleFilterStatus>("all");

  return (
    <>
      <CycleHeader
        projectId={projectId}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <CycleList projectId={projectId} filterStatus={filterStatus} />
    </>
  );
};
