import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm } from "antd";
import { useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_PATCH_TASKS } from "gql/mutations";

interface props {
  patchId: string;
  refetchQueries: string[];
  disabled?: boolean;
}
export const UnscheduleTasks: React.FC<props> = ({
  patchId,
  refetchQueries,
  disabled,
}) => {
  const dispatchToast = useToastContext();
  const [abort, setAbort] = useState(true);
  const [
    unschedulePatchTasks,
    { loading: loadingUnschedulePatchTasks },
  ] = useMutation<
    UnschedulePatchTasksMutation,
    UnschedulePatchTasksMutationVariables
  >(UNSCHEDULE_PATCH_TASKS, {
    onCompleted: () => {
      dispatchToast.success(
        `All tasks were unscheduled ${
          abort ? "and tasks that already started were aborted" : ""
        }`
      );
      setAbort(false);
    },
    onError: (err) => {
      dispatchToast.error(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

  const { sendEvent } = useVersionAnalytics();

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
        sendEvent({ name: "Unschedule", abort });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="unschedule-patch"
        disabled={loadingUnschedulePatchTasks || disabled}
      >
        Unschedule all tasks
      </DropdownItem>
    </Popconfirm>
  );
};

const StyledBody = styled(Body)`
  padding-bottom: ${size.xs};
  padding-right: ${size.xs};
`;
