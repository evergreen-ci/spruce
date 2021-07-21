import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  childPatches: Partial<Patch>[];
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({ baseVersionID, githash, id, projectID, status, taskCount }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          projectName={projectID}
          status={status}
          childPatchId={id}
          taskCount={taskCount}
          githash={githash}
          baseVersionID={baseVersionID}
        />
      )
    )}
  </>
);
