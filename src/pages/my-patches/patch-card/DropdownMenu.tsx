import React, { useState } from "react";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import {
  SchedulePatchTasksPopconfirm,
  UnschedulePatchTasksPopconfirm,
  RestartPatch,
} from "components/PatchActionButtons";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { paths } from "constants/routes";

interface Props {
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({ patchId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hideMenu = () => setIsVisible(false);

  const dropdownItems = [
    <LinkToReconfigurePage key="reconfigure" patchId={patchId} />,
    <SchedulePatchTasksPopconfirm
      key="schedule"
      patchId={patchId}
      hideMenu={hideMenu}
    />,
    <UnschedulePatchTasksPopconfirm
      key="unschedule"
      patchId={patchId}
      hideMenu={hideMenu}
    />,
    <RestartPatch
      data-cy="restart-patch-link"
      key="restart"
      patchId={patchId}
      disabled={false}
      refetchQueries={["PatchBuildVariantsAndStatus"]}
      hideMenu={hideMenu}
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
