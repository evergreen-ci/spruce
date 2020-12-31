import React, { useState, useRef } from "react";
import get from "lodash/get";
import { ButtonDropdown } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SchedulePatchTasks,
  UnschedulePatchTasks,
  RestartPatch,
  EnqueuePatch,
} from "components/PatchActionButtons";
import { useOnClickOutside } from "hooks";

interface Props {
  patchId: string;
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
  patchDescription: string;
}
export const DropdownMenu: React.FC<Props> = ({
  patchId,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
  patchDescription,
}) => {
  const restartModalVisibilityControl = useState(false);
  const enqueueModalVisibilityControl = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideMenu = () => setIsVisible(false);
  const popconfirmRef = useRef(null);
  const scheduleTasksRef = useRef(null); // schedule and unschedule refs must be different for useOnClickOutside to work
  const dropdownWrapperRef = useRef(null);

  useOnClickOutside(dropdownWrapperRef, () => {
    if (
      !restartModalVisibilityControl[0] &&
      !enqueueModalVisibilityControl[0] &&
      !get(popconfirmRef, "current.className", "").includes(
        "ant-popover-open"
      ) &&
      !get(scheduleTasksRef, "current.className", "").includes(
        "ant-popover-open"
      )
    ) {
      hideMenu();
    }
  });

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={patchId}
      disabled={isPatchOnCommitQueue}
    />,
    <SchedulePatchTasks
      key="schedule"
      patchId={patchId}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
      disabled={isActionLoading}
      setParentLoading={setIsActionLoading}
      ref={scheduleTasksRef}
    />,
    <UnschedulePatchTasks
      key="unschedule"
      patchId={patchId}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
      disabled={isActionLoading}
      setParentLoading={setIsActionLoading}
      ref={popconfirmRef}
    />,
    <RestartPatch
      visibilityControl={restartModalVisibilityControl}
      key="restart"
      patchId={patchId}
      disabled={isActionLoading}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
    />,
    <EnqueuePatch
      visibilityControl={enqueueModalVisibilityControl}
      key="enqueue"
      patchId={patchId}
      commitMessage={patchDescription}
      disabled={isActionLoading || !canEnqueueToCommitQueue}
      hideMenu={hideMenu}
      setParentLoading={setIsActionLoading}
      refetchQueries={refetchQueries}
    />,
  ];

  return (
    <div ref={dropdownWrapperRef}>
      <ButtonDropdown
        dataCyBtn="patch-card-dropdown"
        isVisibleDropdown={isVisible}
        dropdownItems={dropdownItems}
        setIsVisibleDropdown={setIsVisible}
      />
    </div>
  );
};

const refetchQueries = ["PatchBuildVariantsAndStatus"];
