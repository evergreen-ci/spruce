import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Disclaimer, Body } from "@leafygreen-ui/typography";
import { Popconfirm } from "antd";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { useBannerDispatchContext } from "context/banners";
import {
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_PATCH_TASKS } from "gql/mutations";

interface UnscheduleProps {
  patchId: string;
  refetchQueries: string[];
  disabled?: boolean;
}
export const UnschedulePatchTasks: React.FC<UnscheduleProps> = ({
  patchId,
  refetchQueries,
  disabled,
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
    },
    onError: (err) => {
      errorBanner(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

  const patchAnalytics = usePatchAnalytics();

  return (
    <Popconfirm
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
      onConfirm={() => {
        unschedulePatchTasks({ variables: { patchId, abort } });
        patchAnalytics.sendEvent({ name: "Unschedule", abort });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="unschedule-patch"
        disabled={loadingUnschedulePatchTasks || disabled}
      >
        <Disclaimer>Unschedule all tasks</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

export const StyledBody = styled(Body)`
  padding-bottom: 8px;
  padding-right: 8px;
`;
