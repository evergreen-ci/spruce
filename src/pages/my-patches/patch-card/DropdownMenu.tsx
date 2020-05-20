import React, { useState } from "react";
import { ButtonDropdown } from "components/ButtonDropdown";
import {
  SchedulePatchTasksPopconfirm,
  UnschedulePatchTasksPopconfirm,
  RestartPatch,
} from "components/PatchActionButtons";
import { DropdownItem } from "components/ButtonDropdown";
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
    <Link key="reconfigure" to={`${paths.patch}/${patchId}/configure`}>
      <DropdownItem disabled={false} data-cy="unschedule-patch">
        <Disclaimer>Reconfigure Tasks/Variants</Disclaimer>
      </DropdownItem>
    </Link>,
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
      key="restart"
      patchId={patchId}
      disabled={false}
      refetchQueries={["PatchBuildVariantsAndStatus"]}
      hideMenu={hideMenu}
    />,
  ];

  return (
    <ButtonDropdown
      isVisibleDropdown={isVisible}
      dropdownItems={dropdownItems}
      setIsVisibleDropdown={setIsVisible}
    />
  );
};
