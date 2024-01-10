import { Divider } from "components/styles/divider";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { BuildVariantsWithChildrenQuery } from "gql/generated/types";
import { versionSelectedTasks } from "hooks/useVersionTaskStatusSelect";
import { BuildVariantAccordion } from "./BuildVariantAccordion";

interface VersionTasksProps {
  baseStatusFilterTerm: string[];
  selectedTasks: versionSelectedTasks;
  setBaseStatusFilterTerm: (statuses: string[]) => void;
  setVersionStatusFilterTerm: (statuses: string[]) => void;
  toggleSelectedTask: (
    taskIds: { [patchId: string]: string } | { [patchId: string]: string[] },
  ) => void;
  version: BuildVariantsWithChildrenQuery["version"];
  versionStatusFilterTerm: string[];
}

const VersionTasks: React.FC<VersionTasksProps> = ({
  baseStatusFilterTerm,
  selectedTasks,
  setBaseStatusFilterTerm,
  setVersionStatusFilterTerm,
  toggleSelectedTask,
  version,
  versionStatusFilterTerm,
}) => {
  const { buildVariants, id: versionId } = version || {};
  const tasks = selectedTasks[versionId] || {};

  return versionId && buildVariants ? (
    <>
      <TaskStatusFilters
        onChangeBaseStatusFilter={setBaseStatusFilterTerm}
        onChangeStatusFilter={setVersionStatusFilterTerm}
        versionId={versionId}
        selectedBaseStatuses={baseStatusFilterTerm || []}
        selectedStatuses={versionStatusFilterTerm || []}
      />
      {[...buildVariants]
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .map((patchBuildVariant) => (
          <BuildVariantAccordion
            versionId={versionId}
            key={`accordion_${patchBuildVariant.variant}`}
            tasks={patchBuildVariant.tasks}
            displayName={patchBuildVariant.displayName}
            selectedTasks={tasks}
            toggleSelectedTask={toggleSelectedTask}
          />
        ))}
      <Divider />
    </>
  ) : null;
};

export default VersionTasks;
