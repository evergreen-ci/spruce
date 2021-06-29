import React from "react";
import { Table } from "antd";
import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./DownstreamProjectAccordion";

type childPatchesType = Patch["childPatches"];
type childPatch = childPatchesType[0];

interface DownstreamTasksProps {
  childPatches: childPatchesType;
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => {
  return (
    <>
    {childPatches.map(({project,status,patchID, taskCount}) =>   <DownstreamProjectAccordion
          key={`downstream_project_${patchID}`}
          projectName={project}
          status={status}
          childPatchId={patchID}
          taskCount={taskCount}
        />)
    </>
  );
};
