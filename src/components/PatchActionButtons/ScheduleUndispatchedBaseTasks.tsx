import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  ScheduleUndispatchedBaseTasksMutation,
  ScheduleUndispatchedBaseTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_UNDISPATCHED_BASE_TASKS } from "gql/mutations";

interface Props {
  patchId: string;
  disabled: boolean;
}

export const ScheduleUndispatchedBaseTasks: React.FC<Props> = ({
  disabled,
  patchId,
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [scheduleBasePatchTasks] = useMutation<
    ScheduleUndispatchedBaseTasksMutation,
    ScheduleUndispatchedBaseTasksMutationVariables
  >(SCHEDULE_UNDISPATCHED_BASE_TASKS, {
    onCompleted({ scheduleUndispatchedBaseTasks }) {
      const successMessage = `Successfully scheduled ${scheduleUndispatchedBaseTasks.length} tasks`;
      dispatchToast.success(successMessage);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const onConfirm = () => {
    scheduleBasePatchTasks({ variables: { patchId } });
  };

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          disabled={disabled}
          onClick={() => setOpen(!open)}
        >
          Schedule failing base tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy="schedule-undispatched-base-popconfirm"
        open={open}
        onConfirm={onConfirm}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        Are you sure you want to schedule all the undispatched base tasks for
        this patch&apos;s failing tasks?
      </Popconfirm>
    </>
  );
};
