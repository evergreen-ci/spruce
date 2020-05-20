import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
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
  const onCancel = () => setIsVisible(false);

  const dropdownItems = [
    <Link to={`${paths.patch}/${patchId}/configure`}>
      <DropdownItem
        key="reconfigure"
        disabled={false}
        data-cy="unschedule-patch"
      >
        <Disclaimer>Reconfigure Tasks/Variants</Disclaimer>
      </DropdownItem>
    </Link>,
    <SchedulePatchTasksPopconfirm
      key="schedule"
      onConfirm={() => undefined}
      onCancel={onCancel}
      loading={false}
    />,
    <UnschedulePatchTasksPopconfirm
      key="unschedule"
      onConfirm={() => undefined}
      onCancel={onCancel}
      disabled={false}
      checked={false}
      onAbortCheckboxChange={() => undefined}
    />,
    <RestartPatch key="restart" disabled={false} />,
  ];

  return (
    <ButtonDropdown
      isVisibleDropdown={isVisible}
      dropdownItems={dropdownItems}
      setIsVisibleDropdown={setIsVisible}
    />
  );
};
