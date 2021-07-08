import React from "react";
import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

type childPatchesType = Patch["childPatches"];

interface DownstreamTasksProps {
  childPatches: childPatchesType;
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(({ project, status, patchID, taskCount }) => (
      <DownstreamProjectAccordion
        key={`downstream_project_${patchID}`}
        projectName={project}
        status={status}
        childPatchId={patchID}
        taskCount={taskCount}
      />
    ))}
  </>
);
