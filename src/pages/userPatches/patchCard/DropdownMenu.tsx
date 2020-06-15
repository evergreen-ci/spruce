import React, { useState, useRef } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import {
  SchedulePatchTasks,
  UnschedulePatchTasks,
  RestartPatch,
} from "components/PatchActionButtons";
import { useOnClickOutside } from "hooks";
import get from "lodash/get";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";

interface Props {
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({ patchId }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideMenu = () => setIsVisible(false);
  const popconfirmRef = useRef(null);
  const scheduleTasksRef = useRef(null); // schedule and unschedule refs must be different for useOnClickOutside to work
  const dropdownWrapperRef = useRef(null);

  useOnClickOutside(dropdownWrapperRef, () => {
    if (
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
    <LinkToReconfigurePage key="reconfigure" patchId={patchId} />,
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
      key="restart"
      patchId={patchId}
      disabled={isActionLoading}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
      ref={popconfirmRef}
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
