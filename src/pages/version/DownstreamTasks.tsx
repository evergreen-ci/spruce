import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
}

export const DownstreamTasks: React.VFC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({ id, githash, projectIdentifier, status, taskCount, versionFull }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          projectName={projectIdentifier}
          status={versionFull?.status ?? status}
          childPatchId={id}
          taskCount={taskCount}
          githash={githash}
          baseVersionID={versionFull?.baseVersion?.id}
        />
      )
    )}
  </>
);
