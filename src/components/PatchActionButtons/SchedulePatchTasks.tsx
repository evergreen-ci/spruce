import React, { forwardRef } from "react";
import { useMutation } from "@apollo/client";
import { Disclaimer } from "@leafygreen-ui/typography";
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
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  isButton?: boolean;
  refetchQueries: string[];
  disabled: boolean;
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}
export const SchedulePatchTasks = forwardRef<
  HTMLDivElement,
  SchedulePatchTasksProps
>(
  (
    {
      patchId,
      hideMenu,
      isButton = false,
      disabled,
      refetchQueries,
      setParentLoading = () => undefined,
    },
    ref
  ) => {
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
        hideMenu();
        setParentLoading(false);
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
          setParentLoading(true);
          schedulePatchTasks();
          patchAnalytics.sendEvent({ name: "Schedule" });
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
            data-cy="schedule-patch"
            ref={ref}
            disabled={loadingSchedulePatchTasks || disabled}
          >
            <Disclaimer>Schedule All Tasks</Disclaimer>
          </DropdownItem>
        )}
      </Popconfirm>
    );
  }
);
