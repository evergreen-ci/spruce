import { VersionQuery } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./downstreamTasks/DownstreamProjectAccordion";

interface DownstreamTasksProps {
  childPatches: VersionQuery["version"]["patch"]["childPatches"];
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => (
  <>
    {childPatches.map(
      ({
        githash,
        id,
        parameters,
        projectIdentifier,
        status,
        taskCount,
        versionFull,
      }) => (
        <DownstreamProjectAccordion
          key={`downstream_project_${id}`}
          projectName={projectIdentifier}
          status={versionFull?.status ?? status}
          childPatchId={id}
          taskCount={taskCount}
          githash={githash}
          baseVersionID={versionFull?.baseVersion?.id}
          parameters={parameters}
        />
      ),
    )}
  </>
);
