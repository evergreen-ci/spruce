import React, { useState } from "react";
import styled from "@emotion/styled";
import { useBannerDispatchContext } from "context/banners";
import {
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_PATCH_TASKS } from "gql/mutations";
import { useMutation } from "@apollo/react-hooks";
import { Popconfirm } from "antd";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer, Body } from "@leafygreen-ui/typography";
import { DropdownItem } from "components/ButtonDropdown";

interface UnscheduleProps {
  patchId: string;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  refetchQueries?: string[];
}
export const UnschedulePatchTasks: React.FC<UnscheduleProps> = ({
  patchId,
  hideMenu,
  refetchQueries,
}) => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const [abort, setAbort] = useState(false);
  const [
    unschedulePatchTasks,
    { loading: loadingUnschedulePatchTasks },
  ] = useMutation<
    UnschedulePatchTasksMutation,
    UnschedulePatchTasksMutationVariables
  >(UNSCHEDULE_PATCH_TASKS, {
    onCompleted: () => {
      successBanner(
        `All tasks were unscheduled ${
          abort ? "and tasks that already started were aborted" : ""
        }`
      );
      setAbort(false);
      hideMenu();
    },
    onError: (err) => {
      errorBanner(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <Popconfirm
      key="unschedule"
      icon={null}
      placement="left"
      title={
        <>
          <StyledBody>Unschedule all tasks?</StyledBody>
          <Checkbox
            data-cy="abort-checkbox"
            label="Abort tasks that have already started"
            onChange={() => setAbort(!abort)}
            checked={abort}
            bold={false}
          />
        </>
      }
      onConfirm={() => unschedulePatchTasks({ variables: { patchId, abort } })}
      onCancel={hideMenu}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="unschedule-patch"
        disabled={loadingUnschedulePatchTasks}
      >
        <Disclaimer>Unschedule All Tasks</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

export const StyledBody = styled(Body)`
  padding-bottom: 8px;
  padding-right: 8px;
`;
