import React from "react";
import { useBannerDispatchContext } from "context/banners";
import {
  SchedulePatchTasksMutation,
  SchedulePatchTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_PATCH_TASKS } from "gql/mutations";
import { useMutation } from "@apollo/react-hooks";
import { Popconfirm } from "antd";
import { Button } from "components/Button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { DropdownItem } from "components/ButtonDropdown";

interface SchedulePatchTasksProps {
  patchId: string;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isButton?: boolean;
  refetchQueries: string[];
  disabled: boolean;
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}
export const SchedulePatchTasks: React.FC<SchedulePatchTasksProps> = ({
  patchId,
  hideMenu,
  isButton = false,
  disabled,
  refetchQueries,
  setParentLoading = () => undefined,
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
      hideMenu();
      setParentLoading(false);
    },
    onError: (err) => {
      errorBanner(`Error scheduling tasks: ${err.message}`);
      setParentLoading(false);
    },
    refetchQueries,
  });

  return (
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title="Schedule all tasks?"
      onConfirm={() => {
        setParentLoading(true);
        schedulePatchTasks();
      }}
      onCancel={hideMenu}
      okText="Yes"
      cancelText="Cancel"
    >
      {isButton ? (
        <Button
          size="small"
          dataCy="schedule-patch"
          disabled={loadingSchedulePatchTasks || disabled}
          loading={loadingSchedulePatchTasks}
        >
          Schedule
        </Button>
      ) : (
        <DropdownItem
          disabled={loadingSchedulePatchTasks || disabled}
          data-cy="schedule-patch"
        >
          <Disclaimer>Schedule All Tasks</Disclaimer>
        </DropdownItem>
      )}
    </Popconfirm>
  );
};
