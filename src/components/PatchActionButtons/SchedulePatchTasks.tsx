import React from "react";
import { useMutation } from "@apollo/client";
import { Popconfirm } from "antd";
import { usePatchAnalytics } from "analytics";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { useBannerDispatchContext } from "context/banners";
import {
  SchedulePatchTasksMutation,
  SchedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_PATCH_TASKS } from "gql/mutations";

interface SchedulePatchTasksProps {
  patchId: string;
  isButton?: boolean;
  refetchQueries: string[];
  disabled?: boolean;
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}
export const SchedulePatchTasks: React.FC<SchedulePatchTasksProps> = ({
  patchId,
  isButton = false,
  disabled,
  refetchQueries,
}) => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const [
    schedulePatchTasks,
    { loading: loadingSchedulePatchTasks },
  ] = useMutation<
    SchedulePatchTasksMutation,
    SchedulePatchTasksMutationVariables
  >(SCHEDULE_PATCH_TASKS, {
    variables: { patchId },
    onCompleted: () => {
      successBanner("All tasks were scheduled");
    },
    onError: (err) => {
      errorBanner(`Error scheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });
  const patchAnalytics = usePatchAnalytics();

  return (
    <Popconfirm
      icon={null}
      placement="left"
      title="Schedule all tasks?"
      onConfirm={() => {
        schedulePatchTasks();
        patchAnalytics.sendEvent({ name: "Schedule" });
      }}
      okText="Yes"
      cancelText="Cancel"
    >
      {isButton ? (
        <Button
          size="small"
          data-cy="schedule-patch"
          disabled={loadingSchedulePatchTasks || disabled}
          loading={loadingSchedulePatchTasks}
        >
          Schedule
        </Button>
      ) : (
        <DropdownItem
          data-cy="schedule-patch"
          disabled={loadingSchedulePatchTasks || disabled}
        >
          Schedule All Tasks
        </DropdownItem>
      )}
    </Popconfirm>
  );
};
