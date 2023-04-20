import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { UNSCHEDULE_PATCH_TASKS } from "gql/mutations";

interface props {
  patchId: string;
  refetchQueries?: string[];
  disabled?: boolean;
}
export const UnscheduleTasks: React.VFC<props> = ({
  patchId,
  refetchQueries = [],
  disabled,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(patchId);

  const [abort, setAbort] = useState(true);

  const [unschedulePatchTasks, { loading: loadingUnschedulePatchTasks }] =
    useMutation<
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

  const onConfirm = () => {
    unschedulePatchTasks({ variables: { patchId, abort } });
    sendEvent({ name: "Unschedule", abort });
  };

  return (
    <Popconfirm
      align="left"
      data-cy="unschedule-patch-popconfirm"
      onConfirm={onConfirm}
      trigger={
        <div>
          <MenuItem
            data-cy="unschedule-patch"
            disabled={disabled || loadingUnschedulePatchTasks}
          >
            Unschedule all tasks
          </MenuItem>
        </div>
      }
    >
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
    </Popconfirm>
  );
};

const StyledBody = styled(Body)`
  padding-bottom: ${size.xs};
  padding-right: ${size.xs};
`;
