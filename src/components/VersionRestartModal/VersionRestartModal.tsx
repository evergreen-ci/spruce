import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { usePatchAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { Modal } from "components/Modal";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { useToastContext } from "context/toast";
import {
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables,
  Patch,
  RestartVersionsMutation,
  RestartVersionsMutationVariables,
} from "gql/generated/types";
import { RESTART_VERSIONS } from "gql/mutations";
import { GET_BUILD_VARIANTS_WITH_CHILDREN } from "gql/queries";
import { usePatchStatusSelect } from "hooks";
import {
  patchSelectedTasks,
  selectedStrings,
} from "hooks/usePatchStatusSelect";
import { BuildVariantAccordian } from "./BuildVariantAccordian";

const { gray } = uiColors;

interface Props {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  versionId?: string;
  refetchQueries: string[];
  childPatches: Partial<Patch>[];
}
const VersionRestartModal: React.FC<Props> = ({
  visible,
  onOk,
  onCancel,
  versionId,
  refetchQueries,
}) => {
  const dispatchToast = useToastContext();
  const [shouldAbortInProgressTasks, setShouldAbortInProgressTasks] = useState(
    false
  );
  const [restartVersions, { loading: mutationLoading }] = useMutation<
    RestartVersionsMutation,
    RestartVersionsMutationVariables
  >(RESTART_VERSIONS, {
    onCompleted: () => {
      onOk();
      dispatchToast.success(`Successfully restarted tasks!`);
    },
    onError: (err) => {
      onOk();
      dispatchToast.error(`Error while restarting tasks: '${err.message}'`);
    },
    refetchQueries,
  });

  const { data } = useQuery<
    BuildVariantsWithChildrenQuery,
    BuildVariantsWithChildrenQueryVariables
  >(GET_BUILD_VARIANTS_WITH_CHILDREN, {
    variables: { id: versionId },
  });

  const { version } = data || {};
  const { buildVariants, childVersions } = version || {};
  const [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ] = usePatchStatusSelect(buildVariants, versionId, childVersions);

  const setVersionStatus = (childVersionId) => (selectedFilters: string[]) => {
    setPatchStatusFilterTerm({ [childVersionId]: selectedFilters });
  };
  const setVersionBaseStatus = (childVersionId) => (
    selectedFilters: string[]
  ) => {
    setBaseStatusFilterTerm({ [childVersionId]: selectedFilters });
  };

  const patchAnalytics = usePatchAnalytics();

  const handlePatchRestart = async (e): Promise<void> => {
    e.preventDefault();
    try {
      patchAnalytics.sendEvent({
        name: "Restart",
        abort: shouldAbortInProgressTasks,
      });
      await restartVersions({
        variables: {
          versionId: version?.id,
          versionsToRestart: getTaskIds(selectedTasks),
          abort: shouldAbortInProgressTasks,
        },
      });
    } catch {
      // This is handled in the onError handler for the mutation
    }
  };

  const selectedTotal = selectTasksTotal(selectedTasks || {});

  return (
    <Modal
      title="Modify Version"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          data-cy="cancel-restart-modal-button"
        >
          Cancel
        </Button>,
        <Button
          key="restart"
          data-cy="restart-patch-button"
          disabled={selectedTotal === 0 || mutationLoading}
          onClick={handlePatchRestart}
          variant="danger"
        >
          Restart
        </Button>,
      ]}
      data-cy="version-restart-modal"
    >
      <VersionTasks
        version={version}
        selectedTasks={selectedTasks}
        setBaseStatusFilterTerm={setVersionBaseStatus(version?.id)}
        setPatchStatusFilterTerm={setVersionStatus(version?.id)}
        toggleSelectedTask={toggleSelectedTask}
        baseStatusFilterTerm={baseStatusFilterTerm[version?.id]}
        patchStatusFilterTerm={patchStatusFilterTerm[version?.id]}
      />

      {childVersions && (
        <div data-cy="select-downstream">
          <ConfirmationMessage weight="medium" data-cy="confirmation-message">
            Downstream Tasks
          </ConfirmationMessage>
          {childVersions?.map((v) => (
            <div key={v?.id}>
              <Accordion
                key={v?.id}
                title={
                  <BoldTextStyle>
                    {v?.projectIdentifier ? v?.projectIdentifier : v?.project}
                  </BoldTextStyle>
                }
                contents={
                  <TitleContainer>
                    <VersionTasks
                      version={v}
                      selectedTasks={selectedTasks}
                      setBaseStatusFilterTerm={setVersionBaseStatus(v?.id)}
                      setPatchStatusFilterTerm={setVersionStatus(v?.id)}
                      toggleSelectedTask={toggleSelectedTask}
                      baseStatusFilterTerm={baseStatusFilterTerm[v.id]}
                      patchStatusFilterTerm={patchStatusFilterTerm[v.id]}
                    />
                  </TitleContainer>
                }
              />
            </div>
          ))}
          <br />
        </div>
      )}

      <ConfirmationMessage weight="medium" data-cy="confirmation-message">
        Are you sure you want to restart the {selectedTotal} selected tasks?
      </ConfirmationMessage>
      <Checkbox
        onChange={() =>
          setShouldAbortInProgressTasks(!shouldAbortInProgressTasks)
        }
        label="Abort in progress tasks"
        checked={shouldAbortInProgressTasks}
        bold={false}
      />
    </Modal>
  );
};

interface VersionTasksProps {
  version: BuildVariantsWithChildrenQuery["version"];
  selectedTasks: patchSelectedTasks;
  setBaseStatusFilterTerm: (statuses: string[]) => void;
  setPatchStatusFilterTerm: (statuses: string[]) => void;
  toggleSelectedTask: (
    taskIds: { [patchId: string]: string } | { [patchId: string]: string[] }
  ) => void;
  baseStatusFilterTerm: string[];
  patchStatusFilterTerm: string[];
}

const VersionTasks: React.FC<VersionTasksProps> = ({
  version,
  selectedTasks,
  setBaseStatusFilterTerm,
  setPatchStatusFilterTerm,
  toggleSelectedTask,
  baseStatusFilterTerm,
  patchStatusFilterTerm,
}) => {
  const { buildVariants } = version || {};
  const tasks = selectedTasks[version?.id] || {};

  return (
    <>
      {buildVariants && (
        <>
          <Row>
            <TaskStatusFilters
              onChangeBaseStatusFilter={setBaseStatusFilterTerm}
              onChangeStatusFilter={setPatchStatusFilterTerm}
              versionId={version?.id}
              selectedBaseStatuses={baseStatusFilterTerm || []}
              selectedStatuses={patchStatusFilterTerm || []}
              filterWidth="50%"
            />
          </Row>
          {buildVariants.map((patchBuildVariant) => (
            <BuildVariantAccordian
              versionId={version?.id}
              key={`accoridan_${patchBuildVariant.variant}`}
              tasks={patchBuildVariant.tasks}
              displayName={patchBuildVariant.displayName}
              selectedTasks={tasks}
              toggleSelectedTask={toggleSelectedTask}
            />
          ))}
          <HR />
        </>
      )}
    </>
  );
};

const selectedArray = (selected: selectedStrings) => {
  const out: string[] = [];
  Object.keys(selected).forEach((task) => {
    if (selected[task]) {
      out.push(task);
    }
  });

  return out;
};

const selectTasksTotal = (selectedTasks: patchSelectedTasks) =>
  Object.values(selectedTasks).reduce(
    (total, selectedTask) => selectedArray(selectedTask).length + total,
    0
  );

const getTaskIds = (selectedTasks: patchSelectedTasks) =>
  Object.entries(selectedTasks).map(([versionId, tasks]) => ({
    versionId,
    taskIds: selectedArray(tasks),
  }));

const HR = styled.hr`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
`;

const ConfirmationMessage = styled(Body)`
  padding-top: 15px;
  padding-bottom: 15px;
`;

const Row = styled.div`
  display: flex;
  >: first-child {
    margin-right: 16px;
  }
`;

export const TitleContainer = styled.div`
  margin-top: 15px;
  width: 96%;
`;

const BoldTextStyle = styled.div`
  font-weight: bold;
  top: 1px;
  color: ${gray.dark2}; // theme colors.gray[1]
`;

export default VersionRestartModal;
