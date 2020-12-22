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
}
export const DropdownMenu: React.FC<Props> = ({
  patchId,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
}) => {
  const restartModalVisibilityControl = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideMenu = () => setIsVisible(false);
  const popconfirmRef = useRef(null);
  const scheduleTasksRef = useRef(null); // schedule, unschedule, and enqueue refs must be different for useOnClickOutside to work
  const enqueueRef = useRef(null);
  const dropdownWrapperRef = useRef(null);

  useOnClickOutside(dropdownWrapperRef, () => {
    if (
      !restartModalVisibilityControl[0] &&
      !get(popconfirmRef, "current.className", "").includes(
        "ant-popover-open"
      ) &&
      !get(scheduleTasksRef, "current.className", "").includes(
        "ant-popover-open"
      ) &&
      !get(enqueueRef, "current.className", "").includes("ant-popover-open")
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
      key="enqueue"
      patchId={patchId}
      hideMenu={hideMenu}
      disabled={isActionLoading || !canEnqueueToCommitQueue}
      refetchQueries={refetchQueries}
      setParentLoading={setIsActionLoading}
      ref={enqueueRef}
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
