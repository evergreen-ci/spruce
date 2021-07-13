import React from "react";
import { DownstreamProjectAccordion } from "./DownstreamProjectAccordion";

interface DownstreamTasksProps {
  childPatches: any[];
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
