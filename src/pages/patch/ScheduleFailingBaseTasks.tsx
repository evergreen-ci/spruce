import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
import { useToastContext } from "context/toast";
import {
  ScheduleFailingBasePatchTasksMutation,
  ScheduleFailingBasePatchTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_FAILING_BASE_PATCH_TASKS } from "gql/mutations";

interface Props {
  patchId: string;
}
export const ScheduleFailingBaseTasks: React.FC<Props> = ({ patchId }) => {
  const dispatchToast = useToastContext();
  const [scheduleBasePatchTasks] = useMutation<
    ScheduleFailingBasePatchTasksMutation,
    ScheduleFailingBasePatchTasksMutationVariables
  >(SCHEDULE_FAILING_BASE_PATCH_TASKS, {
    onCompleted({ scheduleFailingBasePatchTasks }) {
      const successMessage = `Successfully scheduled ${scheduleFailingBasePatchTasks.length} tasks`;
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
        <>
          <Body>
            Are you sure you want to schedule all the undispatched base tasks
            for this patches failing tasks?
          </Body>
        </>
      }
      onConfirm={() => {
        scheduleBasePatchTasks({ variables: { patchId } });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem key="reschedule-failing">
        Schedule failing base tasks
      </DropdownItem>
    </Popconfirm>
  );
};
