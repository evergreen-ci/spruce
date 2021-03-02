import React from "react";
import { useMutation } from "@apollo/client";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SchedulePatchTasks,
  RestartPatch,
  UnschedulePatchTasks,
  SetPatchPriority,
  EnqueuePatch,
  AddNotification,
} from "components/PatchActionButtons";
import { PageButtonRow } from "components/styles";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  patchId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
  patchDescription,
  patchId,
}) => {
  const dispatchToast = useToastContext();
  const [disablePatch] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      dispatchToast.success(`Tasks in this patch were disabled`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to disable patch tasks: ${err.message}`);
    },
    refetchQueries: ["Patch"],
  });

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={patchId}
      disabled={isPatchOnCommitQueue}
    />,
    <UnschedulePatchTasks
      patchId={patchId}
      refetchQueries={["Patch"]}
      key="unschedule"
    />,
    <DropdownItem
      key="disable-button"
      data-cy="disable"
      disabled={false}
      onClick={() => {
        disablePatch({
          variables: { patchId, priority: -1 },
        });
      }}
    >
      Disable all tasks
    </DropdownItem>,
    <SetPatchPriority
      patchId={patchId}
      key="priority"
      refetchQueries={["Patch"]}
    />,
    <EnqueuePatch
      patchId={patchId}
      commitMessage={patchDescription}
      key="enqueue"
      disabled={!canEnqueueToCommitQueue}
      refetchQueries={["Patch"]}
    />,
  ];

  return (
    <>
      <PageButtonRow>
        <SchedulePatchTasks
          patchId={patchId}
          isButton
          refetchQueries={["Patch"]}
        />
        <RestartPatch patchId={patchId} isButton refetchQueries={["Patch"]} />
        <AddNotification patchId={patchId} refetchQueries={["Patch"]} />
        <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
      </PageButtonRow>
    </>
  );
};
