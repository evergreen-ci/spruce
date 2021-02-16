import React, { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SchedulePatchTasks,
  UnschedulePatchTasks,
  RestartPatch,
  EnqueuePatch,
} from "components/PatchActionButtons";

interface Props {
  patchId: string;
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
}
export const DropdownMenu: React.FC<Props> = ({
  patchId,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
}) => {
  const restartModalVisibilityControl = useState(false);
  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={patchId}
      disabled={isPatchOnCommitQueue}
    />,
    <SchedulePatchTasks
      key="schedule"
      patchId={patchId}
      refetchQueries={refetchQueries}
    />,
    <UnschedulePatchTasks
      key="unschedule"
      patchId={patchId}
      refetchQueries={refetchQueries}
    />,
    <RestartPatch
      visibilityControl={restartModalVisibilityControl}
      key="restart"
      patchId={patchId}
      refetchQueries={refetchQueries}
    />,
    <EnqueuePatch
      key="enqueue"
      patchId={patchId}
      disabled={!canEnqueueToCommitQueue}
      refetchQueries={refetchQueries}
    />,
  ];

  return (
    <ButtonDropdown
      data-cy="patch-card-dropdown"
      dropdownItems={dropdownItems}
    />
  );
};

const refetchQueries = ["patchBuildVariants"];
