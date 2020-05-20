import React, { useState } from "react";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { ButtonDropdown } from "components/ButtonDropdown";
import {
  SchedulePatchTasksPopconfirm,
  UnschedulePatchTasksPopconfirm,
  SetPatchPriorityPopconfirm,
  RestartPatch,
} from "components/PatchActionButtons";

export const DropdownMenu: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const onCancel = () => setIsVisible(false);

  const dropdownItems = [
    <SchedulePatchTasksPopconfirm
      onConfirm={() => undefined}
      onCancel={onCancel}
      loading={false}
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
