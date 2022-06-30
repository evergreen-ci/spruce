import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  RestartPatch,
  UnscheduleTasks,
  SetPatchPriority,
  EnqueuePatch,
  AddNotification,
  DisableTasks,
} from "components/PatchActionButtons";

import { PageButtonRow } from "components/styles";
import { ScheduleUndispatchedBaseTasks } from "./ScheduleUndispatchedBaseTasks";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  canReconfigure: boolean;
  isPatch: boolean;
  isPatchOnCommitQueue: boolean;
  isVersionActivated: boolean;
  patchDescription: string;
  versionId: string;
}

export const ActionButtons: React.VFC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  canReconfigure,
  isPatch,
  isPatchOnCommitQueue,
  isVersionActivated,
  patchDescription,
  versionId,
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

  // Should be able to modify tasks for any version, that is not on the commit queue
  return (
    <>
      <PageButtonRow>
        <ScheduleTasks
          versionId={versionId}
          isButton
          disabled={isPatchOnCommitQueue}
        />
        <RestartPatch
          patchId={versionId}
          isButton
          disabled={isPatchOnCommitQueue || !isVersionActivated}
          refetchQueries={["Patch"]}
        />
        <AddNotification patchId={versionId} refetchQueries={["Patch"]} />
        <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
      </PageButtonRow>
    </>
  );
};
