import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { TreeSelect } from "components/TreeSelect";
import { useBannerDispatchContext } from "context/banners";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
  RestartPatchMutation,
  RestartPatchMutationVariables,
} from "gql/generated/types";
import { RESTART_PATCH } from "gql/mutations/restart-patch";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries/get-patch-build-variants";
import { usePatchStatusSelect } from "hooks";
import { selectedStrings } from "hooks/usePatchStatusSelect";
import { PatchBuildVariantAccordian } from "pages/patch/patchRestartModal/index";
import { TaskStatus } from "types/task";

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
  const dispatchBanner = useBannerDispatchContext();
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
      dispatchBanner.successBanner(`Successfully restarted patch!`);
    },
    onError: (err) => {
      onOk();
      dispatchBanner.errorBanner(
        `Error while restarting patch: '${err.message}'`
      );
    },
    refetchQueries,
  });
  const { data, loading } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId },
  });
  const patchBuildVariants = get(data, "patchBuildVariants");
  const [
    selectedTasks,
    validStatus,
    { toggleSelectedTask, setValidStatus },
  ] = usePatchStatusSelect(patchBuildVariants);

  const patchAnalytics = usePatchAnalytics();
  const handlePatchRestart = async (e): Promise<void> => {
    e.preventDefault();
    dispatchBanner.clearAllBanners();
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
        <Button key="cancel" onClick={onCancel}>
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
      {!loading && patchBuildVariants && (
        <>
          <TreeSelect
            onChange={setValidStatus}
            state={validStatus}
            tData={statusesTreeData}
            inputLabel="Tasks Selected: "
            dataCy="patch-status-filter"
            width="50%"
          />
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

const statusesTreeData = [
  {
    title: "Select All Tasks",
    value: "all",
    key: "all",
  },
  {
    title: "Select All Successful tasks",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: "Select All Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Task Failures",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "System Failures",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
      {
        title: "Setup Failures",
        value: TaskStatus.SetupFailed,
        key: TaskStatus.SetupFailed,
      },
    ],
  },
];
