import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  UnscheduleTasks,
  RestartPatch,
  EnqueuePatch,
  ScheduleTasks,
  SetPatchVisibility,
} from "components/PatchActionButtons";

interface Props {
  canEnqueueToCommitQueue: boolean;
  hasVersion: boolean;
  isPatchHidden: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({
  canEnqueueToCommitQueue,
  hasVersion,
  isPatchHidden,
  isPatchOnCommitQueue,
  patchDescription,
  patchId,
}) => {
  const restartModalVisibilityControl = useState(false);
  const enqueueModalVisibilityControl = useState(false);
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={patchId}
      disabled={isPatchOnCommitQueue}
      hasVersion={hasVersion}
    />,
    <ScheduleTasks key="schedule" versionId={patchId} disabled={!hasVersion} />,
    <UnscheduleTasks
      key="unschedule"
      patchId={patchId}
      refetchQueries={refetchQueries}
      disabled={!hasVersion}
    />,
    <RestartPatch
      visibilityControl={restartModalVisibilityControl}
      key="restart"
      patchId={patchId}
      refetchQueries={refetchQueries}
      disabled={!hasVersion}
    />,
    <EnqueuePatch
      visibilityControl={enqueueModalVisibilityControl}
      key="enqueue"
      patchId={patchId}
      commitMessage={patchDescription}
      disabled={!canEnqueueToCommitQueue || !hasVersion}
      refetchQueries={refetchQueries}
    />,
    <SetPatchVisibility
      key="hide"
      patchId={patchId}
      isPatchHidden={isPatchHidden}
      refetchQueries={["UserPatches", "ProjectPatches"]}
    />,
  ];

  return (
    <ButtonDropdown
      data-cy="patch-card-dropdown"
      dropdownItems={dropdownItems}
    />
  );
};

const refetchQueries = ["Version"];
