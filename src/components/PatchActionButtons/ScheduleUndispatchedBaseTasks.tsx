import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { DropdownItem } from "components/ButtonDropdown";
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
  const [active, setActive] = useState(false);
  const menuItemRef = useRef<HTMLElement>(null);

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
      <DropdownItem
        ref={menuItemRef}
        active={active}
        key="reschedule-failing"
        disabled={disabled}
        onClick={() => setActive(!active)}
      >
        Schedule failing base tasks
      </DropdownItem>
      <Popconfirm
        active={active}
        data-cy="schedule-undispatched-base-popconfirm"
        align="left"
        content={
          <Body>
            Are you sure you want to schedule all the undispatched base tasks
            for this patch&apos;s failing tasks?
          </Body>
        }
        refEl={menuItemRef}
        onConfirm={onConfirm}
        setActive={setActive}
      />
    </>
  );
};
