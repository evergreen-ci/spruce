import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  childPatches: Partial<Patch>[];
}

export const DownstreamTasks: React.VFC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({
        baseVersionID,
        githash,
        id,
        projectIdentifier,
        status,
        taskCount,
        versionFull
      }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          projectName={projectIdentifier}
          status={versionFull.status ?? status}
          childPatchId={id}
          taskCount={taskCount}
          githash={githash}
          baseVersionID={baseVersionID}
        />
      )
    )}
  </>
);
