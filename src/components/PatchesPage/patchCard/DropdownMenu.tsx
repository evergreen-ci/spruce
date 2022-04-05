import { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  UnscheduleTasks,
  RestartPatch,
  EnqueuePatch,
  ScheduleTasks,
} from "components/PatchActionButtons";
import { Patch } from "gql/generated/types";

interface Props {
  patchId: string;
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
  childPatches: Partial<Patch>[];
  hasVersion: boolean;
}
export const DropdownMenu = ({
  patchId,
  childPatches,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
  patchDescription,
  hasVersion,
}: Props): JSX.Element => {
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
      childPatches={childPatches}
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
  ];

  return (
    <ButtonDropdown
      data-cy="patch-card-dropdown"
      dropdownItems={dropdownItems}
    />
  );
};

const refetchQueries = ["Version"];
