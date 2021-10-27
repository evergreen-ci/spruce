import React from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  SchedulePatchTasks,
  RestartPatch,
  UnscheduleTasks,
  SetPatchPriority,
  EnqueuePatch,
  AddNotification,
  DisableTasks,
} from "components/PatchActionButtons";

import { PageButtonRow } from "components/styles";
import { Patch } from "gql/generated/types";
import { ScheduleUndispatchedBaseTasks } from "./ScheduleUndispatchedBaseTasks";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  canReconfigure: boolean;
  patchDescription: string;
  versionId: string;
  childPatches: Partial<Patch>[];
  isPatch: boolean;
  versionActivated: boolean;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  canReconfigure,
  patchDescription,
  versionId,
  childPatches,
  isPatch,
  versionActivated,
}) => {
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={versionId}
      disabled={!canReconfigure}
    />,
    <UnscheduleTasks
      patchId={versionId}
      refetchQueries={["Patch"]}
      key="unschedule-tasks"
    />,
    <DisableTasks
      key="disable-tasks"
      patchId={versionId}
      refetchQueries={["Patch"]}
    />,
    <ScheduleUndispatchedBaseTasks
      key="schedule-undispatched-base-tasks"
      patchId={versionId}
      disabled={!isPatch}
    />,
    <SetPatchPriority
      patchId={versionId}
      key="priority"
      refetchQueries={["Patch"]}
    />,
    <EnqueuePatch
      patchId={versionId}
      commitMessage={patchDescription}
      key="enqueue"
      disabled={!canEnqueueToCommitQueue}
      refetchQueries={["Patch"]}
    />,
  ];

  return (
    <>
      <PageButtonRow>
        {!versionActivated && !isPatch && (
          <ScheduleTasks versionId={versionId} />
        )}
        <SchedulePatchTasks
          patchId={versionId}
          isButton
          refetchQueries={["Patch"]}
        />
        <RestartPatch
          patchId={versionId}
          childPatches={childPatches}
          isButton
          refetchQueries={["Patch"]}
        />
        <AddNotification patchId={versionId} refetchQueries={["Patch"]} />
        <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
      </PageButtonRow>
    </>
  );
};
