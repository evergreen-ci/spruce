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

export const ScheduleUndispatchedBaseTasks: React.VFC<Props> = ({
  patchId,
  disabled,
}) => {
  const dispatchToast = useToastContext();

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
    <Popconfirm
      align="left"
      data-cy="schedule-undispatched-base-popconfirm"
      onConfirm={onConfirm}
      trigger={
        <div>
          <MenuItem key="reschedule-failing" disabled={disabled}>
            Schedule failing base tasks
          </MenuItem>
        </div>
      }
    >
      Are you sure you want to schedule all the undispatched base tasks for this
      patch&apos;s failing tasks?
    </Popconfirm>
  );
};
