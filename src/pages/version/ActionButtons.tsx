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
  patchDescription: string;
  versionId: string;
}

export const ActionButtons: React.VFC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  canReconfigure,
  isPatch,
  isPatchOnCommitQueue,
  patchDescription,
  versionId,
}) => {
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={versionId}
      disabled={!canReconfigure}
    />,
    <UnscheduleTasks patchId={versionId} key="unschedule-tasks" />,
    <DisableTasks key="disable-tasks" patchId={versionId} />,
    <ScheduleUndispatchedBaseTasks
      key="schedule-undispatched-base-tasks"
      patchId={versionId}
      disabled={!isPatch}
    />,
    <SetPatchPriority patchId={versionId} key="priority" />,
    <EnqueuePatch
      patchId={versionId}
      commitMessage={patchDescription}
      key="enqueue"
      disabled={!canEnqueueToCommitQueue}
    />,
  ];

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
          disabled={isPatchOnCommitQueue}
          refetchQueries={["PatchTasks"]}
        />
        <AddNotification patchId={versionId} />
        <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
      </PageButtonRow>
    </>
  );
};
