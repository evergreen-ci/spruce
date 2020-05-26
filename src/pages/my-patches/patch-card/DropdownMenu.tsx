import React, { useState } from "react";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import {
  SchedulePatchTasks,
  UnschedulePatchTasks,
  RestartPatch,
} from "components/PatchActionButtons";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { paths } from "constants/routes";

interface Props {
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({ patchId }) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hideMenu = () => setIsVisible(false);

  const dropdownItems = [
    <LinkToReconfigurePage key="reconfigure" patchId={patchId} />,
    <SchedulePatchTasks
      key="schedule"
      patchId={patchId}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
      disabled={isActionLoading}
      setParentLoading={setIsActionLoading}
    />,
    <UnschedulePatchTasks
      key="unschedule"
      patchId={patchId}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
      disabled={isActionLoading}
      setParentLoading={setIsActionLoading}
    />,
    <RestartPatch
      key="restart"
      patchId={patchId}
      disabled={isActionLoading}
      hideMenu={hideMenu}
      refetchQueries={refetchQueries}
    />,
  ];

  return (
    <ButtonDropdown
      dataCyBtn="patch-card-dropdown"
      isVisibleDropdown={isVisible}
      dropdownItems={dropdownItems}
      setIsVisibleDropdown={setIsVisible}
    />
  );
};

const LinkToReconfigurePage: React.FC<{ patchId: string }> = ({ patchId }) => (
  <Link data-cy="reconfigure-link" to={`${paths.patch}/${patchId}/configure`}>
    <DropdownItem disabled={false}>
      <Disclaimer>Reconfigure Tasks/Variants</Disclaimer>
    </DropdownItem>
  </Link>
);

const refetchQueries = ["PatchBuildVariantsAndStatus"];
