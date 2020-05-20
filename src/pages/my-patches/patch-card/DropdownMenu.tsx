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
import { useBannerDispatchContext } from "context/banners";
import {
  SchedulePatchTasksMutation,
  SchedulePatchTasksMutationVariables,
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import {
  SCHEDULE_PATCH_TASKS,
  UNSCHEDULE_PATCH_TASKS,
  SET_PATCH_PRIORITY,
} from "gql/mutations";

interface Props {
  patchId: string;
}
export const DropdownMenu: React.FC<Props> = ({ patchId }) => {
  const [isVisible, setIsVisible] = useState(false);
  // const { successBanner, errorBanner } = useBannerDispatchContext();
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
      onConfirm={() => undefined}
      onCancel={hideMenu}
    />,
    <UnschedulePatchTasksPopconfirm
      key="unschedule"
      onConfirm={() => undefined}
      onCancel={hideMenu}
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
