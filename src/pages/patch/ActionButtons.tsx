import React from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SchedulePatchTasks,
  RestartPatch,
  UnschedulePatchTasks,
  SetPatchPriority,
  EnqueuePatch,
  AddNotification,
  DisablePatch,
} from "components/PatchActionButtons";
import { PageButtonRow } from "components/styles";
import { ScheduleUndispatchedBaseTasks } from "./ScheduleUndispatchedBaseTasks";

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
    <DisablePatch
      key="disable-patch"
      patchId={patchId}
      refetchQueries={["Patch"]}
    />,
    <ScheduleUndispatchedBaseTasks
      key="schedule-undispatched-base-tasks"
      patchId={patchId}
    />,
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
