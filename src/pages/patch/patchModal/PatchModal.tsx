import React, { useState } from "react";
import { Modal } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body, H2 } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import { useParams } from "react-router-dom";
import { TreeSelect } from "components/TreeSelect";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries/get-patch-build-variants";
import { RESTART_PATCH } from "gql/mutations/restart-patch";
import get from "lodash/get";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
  RestartPatchMutation,
  RestartPatchMutationVariables,
} from "gql/generated/types";
import { usePatchStatusSelect } from "hooks";
import { useBannerDispatchContext } from "context/banners";
import { TaskStatus } from "types/task";
import { PatchBuildVariantAccordian } from "./PatchBuildVariantAccordian";

const { gray } = uiColors;

interface PatchModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}
export const PatchModal: React.FC<PatchModalProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const {
    successBanner,
    errorBanner,
    clearAllBanners,
  } = useBannerDispatchContext();
  const { id } = useParams<{ id: string }>();
  const [abortInProgressTasks, setAbortInProgressTasks] = useState(false);
  const [restartPatch, { loading: mutationLoading }] = useMutation<
    RestartPatchMutation,
    RestartPatchMutationVariables
  >(RESTART_PATCH, {
    onCompleted: () => {
      onOk();
      successBanner(`Successfully restarted patch!`);
    },
    onError: (err) => {
      onOk();
      errorBanner(`Error while restarting patch: '${err.message}'`);
    },
  });
  const { data, loading } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId: id },
  });
  const patchBuildVariants = get(data, "patchBuildVariants");
  const [
    selectedTasks,
    validStatus,
    { toggleSelectedTask, setValidStatus },
  ] = usePatchStatusSelect(patchBuildVariants);

  const handlePatchRestart = async (e): Promise<void> => {
    e.preventDefault();
    clearAllBanners();
    try {
      await restartPatch({
        variables: {
          patchId: id,
          taskIds: selectedTasks,
          abort: abortInProgressTasks,
        },
      });
    } catch {
      // This is handled in the onError handler for the mutation
    }
  };
  return (
    <Modal
      title={<H2>Modify Version</H2>}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>Cancel</Button>,
        <Button
          data-cy="restart-patch-button"
          disabled={selectedTasks.length === 0 || mutationLoading}
          onClick={handlePatchRestart}
          variant="danger"
        >
          Restart
        </Button>,
      ]}
      width="50%"
      wrapProps={{
        "data-cy": "patch-modal",
      }}
    >
      {!loading && patchBuildVariants && (
        <>
          <TreeSelect
            onChange={setValidStatus}
            state={validStatus}
            tData={statusesTreeData}
            inputLabel="Patch Status: "
            dataCy="patch-status-filter"
            width="50%"
          />
          {patchBuildVariants.map((patchBuildVariant) => (
            <PatchBuildVariantAccordian
              key={`accoridan_${patchBuildVariant.variant}`}
              tasks={patchBuildVariant.tasks}
              variant={patchBuildVariant.variant}
              selectedTasks={selectedTasks}
              toggleSelectedTask={toggleSelectedTask}
            />
          ))}
          <HR />
          <ConfirmationMessage weight="medium">
            Are you sure you want to restart the {selectedTasks.length} selected
            tasks?
          </ConfirmationMessage>
          <Checkbox
            onChange={() => setAbortInProgressTasks(!abortInProgressTasks)}
            label="Abort in progress tasks"
            checked={abortInProgressTasks}
            bold={false}
          />
        </>
      )}
    </Modal>
  );
};

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
`;

const ConfirmationMessage = styled(Body)`
  padding-top: 36px;
  padding-bottom: 24px;
`;

const statusesTreeData = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
    ],
  },
  {
    title: "Success",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: "Running",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched,
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started,
  },
  {
    title: "Scheduled",
    value: "scheduled",
    key: "scheduled",
    children: [
      {
        title: "Unstarted",
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
      {
        title: "Undispatched",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched,
      },
    ],
  },
  {
    title: "System Issues",
    value: "system-issues",
    key: "system-issues",
    children: [
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
    ],
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
  {
    title: "Blocked",
    value: TaskStatus.StatusBlocked,
    key: TaskStatus.StatusBlocked,
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
];
