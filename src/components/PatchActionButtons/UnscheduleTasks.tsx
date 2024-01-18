import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import Checkbox from "@leafygreen-ui/checkbox";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
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
export const UnscheduleTasks: React.FC<props> = ({
  disabled,
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(patchId);

  const [abort, setAbort] = useState(true);
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [unschedulePatchTasks, { loading: loadingUnschedulePatchTasks }] =
    useMutation<
      UnschedulePatchTasksMutation,
      UnschedulePatchTasksMutationVariables
    >(UNSCHEDULE_PATCH_TASKS, {
      onCompleted: () => {
        dispatchToast.success(
          `All tasks were unscheduled ${
            abort ? "and tasks that already started were aborted" : ""
          }`,
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
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy="unschedule-patch"
          disabled={disabled || loadingUnschedulePatchTasks}
          onClick={() => setOpen(!open)}
        >
          Unschedule all tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy="unschedule-patch-popconfirm"
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Unschedule all tasks?</Body>
        <Checkbox
          data-cy="abort-checkbox"
          label="Abort tasks that have already started"
          onChange={() => setAbort(!abort)}
          checked={abort}
        />
      </Popconfirm>
    </>
  );
};
