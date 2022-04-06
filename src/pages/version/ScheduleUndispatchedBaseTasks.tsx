import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
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
  return (
    <Popconfirm
      icon={null}
      placement="left"
      title={
        <Body>
          Are you sure you want to schedule all the undispatched base tasks for
          this patch&apos;s failing tasks?
        </Body>
      }
      onConfirm={() => {
        scheduleBasePatchTasks({ variables: { patchId } });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem key="reschedule-failing" disabled={disabled}>
        Schedule failing base tasks
      </DropdownItem>
    </Popconfirm>
  );
};
