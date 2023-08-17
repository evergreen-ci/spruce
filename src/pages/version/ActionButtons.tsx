import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  ScheduleTasks,
  RestartPatch,
  UnscheduleTasks,
  EnqueuePatch,
  AddNotification,
  DisableTasks,
  ScheduleUndispatchedBaseTasks,
} from "components/PatchActionButtons";
import SetPriority from "components/SetPriority";
import { PageButtonRow } from "components/styles";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  canReconfigure: boolean;
  isPatch: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  versionId: string;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
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
    <SetPriority patchId={versionId} key="priority" />,
    <EnqueuePatch
      patchId={versionId}
      commitMessage={patchDescription}
      key="enqueue"
      disabled={!canEnqueueToCommitQueue}
    />,
  ];

  return (
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
        refetchQueries={["VersionTasks"]}
      />
      <AddNotification patchId={versionId} />
      <ButtonDropdown dropdownItems={dropdownItems} loading={false} />
    </PageButtonRow>
  );
};
