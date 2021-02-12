import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { TaskStatusFilters } from "components/TaskStatusFilters";
import { useToastContext } from "context/toast";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
  RestartPatchMutation,
  RestartPatchMutationVariables,
} from "gql/generated/types";
import { RESTART_PATCH } from "gql/mutations";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries";
import { usePatchStatusSelect, usePrevious } from "hooks";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { PatchBuildVariantAccordian } from "pages/patch/patchRestartModal/index";
import { PatchTasksQueryParams } from "types/task";
import { getArray, parseQueryString } from "utils";

const { gray } = uiColors;

interface PatchModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  patchId?: string;
  refetchQueries: string[];
}
export const PatchRestartModal: React.FC<PatchModalProps> = ({
  visible,
  onOk,
  onCancel,
  patchId: patchIdFromProps,
  refetchQueries,
}) => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  const patchId = patchIdFromProps ?? id;
  const [shouldAbortInProgressTasks, setShouldAbortInProgressTasks] = useState(
    false
  );
  const [restartPatch, { loading: mutationLoading }] = useMutation<
    RestartPatchMutation,
    RestartPatchMutationVariables
  >(RESTART_PATCH, {
    onCompleted: () => {
      onOk();
      dispatchToast.success(`Successfully restarted patch!`);
    },
    onError: (err) => {
      onOk();
      dispatchToast.error(`Error while restarting patch: '${err.message}'`);
    },
    refetchQueries,
  });
  const { data } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId },
  });
  const { patchBuildVariants } = data || {};
  const [
    selectedTasks,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    { toggleSelectedTask, setPatchStatusFilterTerm, setBaseStatusFilterTerm },
  ] = usePatchStatusSelect(patchBuildVariants);
  const { search } = useLocation();
  const prevSearch = usePrevious(search);
  useEffect(() => {
    if (search !== prevSearch) {
      const urlParams = parseQueryString(search);
      setPatchStatusFilterTerm(
        getArray(urlParams[PatchTasksQueryParams.Statuses]) ?? []
      );
      setBaseStatusFilterTerm(
        getArray(urlParams[PatchTasksQueryParams.BaseStatuses]) ?? []
      );
    }
  }, [search, prevSearch, setBaseStatusFilterTerm, setPatchStatusFilterTerm]);

  const patchAnalytics = usePatchAnalytics();
  const handlePatchRestart = async (e): Promise<void> => {
    e.preventDefault();
    try {
      patchAnalytics.sendEvent({
        name: "Restart",
        abort: shouldAbortInProgressTasks,
      });
      await restartPatch({
        variables: {
          patchId,
          taskIds: selectedArray(selectedTasks),
          abort: shouldAbortInProgressTasks,
        },
      });
    } catch {
      // This is handled in the onError handler for the mutation
    }
  };

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
          disabled={
            selectedArray(selectedTasks).length === 0 || mutationLoading
          }
          onClick={handlePatchRestart}
          variant="danger"
        >
          Restart
        </Button>,
      ]}
      data-cy="patch-restart-modal"
    >
      {patchBuildVariants && (
        <>
          <Row>
            <TaskStatusFilters
              onChangeBaseStatusFilter={setBaseStatusFilterTerm}
              onChangeStatusFilter={setPatchStatusFilterTerm}
              patchId={patchId}
              selectedBaseStatuses={baseStatusFilterTerm}
              selectedStatuses={patchStatusFilterTerm}
              filterWidth="50%"
            />
          </Row>
          {patchBuildVariants.map((patchBuildVariant) => (
            <PatchBuildVariantAccordian
              key={`accoridan_${patchBuildVariant.variant}`}
              tasks={patchBuildVariant.tasks}
              displayName={patchBuildVariant.displayName}
              selectedTasks={selectedTasks}
              toggleSelectedTask={toggleSelectedTask}
            />
          ))}
          <HR />
          <ConfirmationMessage weight="medium">
            Are you sure you want to restart the{" "}
            {selectedArray(selectedTasks).length} selected tasks?
          </ConfirmationMessage>
          <Checkbox
            onChange={() =>
              setShouldAbortInProgressTasks(!shouldAbortInProgressTasks)
            }
            label="Abort in progress tasks"
            checked={shouldAbortInProgressTasks}
            bold={false}
          />
        </>
      )}
    </Modal>
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

const HR = styled("hr")`
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
