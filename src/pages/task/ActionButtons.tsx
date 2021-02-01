import React, { useRef, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { InputNumber, Popconfirm } from "antd";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { Button } from "components/Button";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { PageButtonRow } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
  AbortTaskMutation,
  AbortTaskMutationVariables,
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTaskMutation,
  ScheduleTaskMutationVariables,
  UnscheduleTaskMutation,
  UnscheduleTaskMutationVariables,
} from "gql/generated/types";
import { ABORT_TASK } from "gql/mutations/abort-task";
import { RESTART_TASK } from "gql/mutations/restart-task";
import { SCHEDULE_TASK } from "gql/mutations/schedule-task";
import { SET_TASK_PRIORTY } from "gql/mutations/set-task-priority";
import { UNSCHEDULE_TASK } from "gql/mutations/unschedule-task";
import { useOnClickOutside, useUpdateURLQueryParams } from "hooks";
import { TaskNotificationModal } from "./actionButtons/TaskNotificationModal";

interface Props {
  initialPriority?: number;
  canAbort: boolean;
  canRestart: boolean;
  canSchedule: boolean;
  canUnschedule: boolean;
  canSetPriority: boolean;
}

export const ActionButtons = ({
  canAbort,
  canRestart,
  canSchedule,
  canSetPriority,
  canUnschedule,
  initialPriority = 1,
}: Props) => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const wrapperRef = useRef(null);
  const priorityRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [priority, setPriority] = useState<number>(initialPriority);
  const { id: taskId } = useParams<{ id: string }>();
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTaskMutation,
    ScheduleTaskMutationVariables
  >(SCHEDULE_TASK, {
    variables: { taskId },
    onCompleted: () => {
      successBanner("Task marked as scheduled");
    },
    onError: (err) => {
      errorBanner(`Error scheduling task: ${err.message}`);
    },
    refetchQueries,
  });

  const [unscheduleTask, { loading: loadingUnscheduleTask }] = useMutation<
    UnscheduleTaskMutation,
    UnscheduleTaskMutationVariables
  >(UNSCHEDULE_TASK, {
    variables: { taskId },
    onCompleted: () => {
      successBanner("Task marked as unscheduled");
    },
    onError: (err) => {
      errorBanner(`Error unscheduling task: ${err.message}`);
    },
    refetchQueries,
  });

  const [abortTask, { loading: loadingAbortTask }] = useMutation<
    AbortTaskMutation,
    AbortTaskMutationVariables
  >(ABORT_TASK, {
    variables: {
      taskId,
    },
    onCompleted: () => {
      successBanner("Task aborted");
    },
    onError: (err) => {
      errorBanner(`Error aborting task: ${err.message}`);
    },
    refetchQueries,
  });

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    variables: { taskId },
    onCompleted: (data) => {
      const { latestExecution } = data.restartTask;
      successBanner("Task scheduled to restart");
      updateQueryParams({
        execution: `${latestExecution}`,
      });
    },
    onError: (err) => {
      errorBanner(`Error restarting task: ${err.message}`);
    },
    refetchQueries,
  });

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORTY, {
    onCompleted: (data) => {
      successBanner(
        data.setTaskPriority.priority >= 0
          ? `Priority for task updated to ${data.setTaskPriority.priority}`
          : `Task was successfully disabled`
      );
    },
    onError: (err) => {
      errorBanner(`Error updating priority for task: ${err.message}`);
    },
    refetchQueries,
  });

  const disabled =
    loadingAbortTask ||
    loadingRestartTask ||
    loadingSetPriority ||
    loadingUnscheduleTask ||
    loadingScheduleTask;

  useEffect(() => {
    if (disabled) {
      setIsVisible(false);
    }
  }, [disabled, setIsVisible]);

  useOnClickOutside(wrapperRef, () => {
    if (
      !get(priorityRef, "current.className", "").includes("ant-popover-open")
    ) {
      setIsVisible(false);
    }
  });

  const dropdownItems = [
    <DropdownItem
      disabled={disabled || !canUnschedule}
      key="unschedule"
      data-cy="unschedule-task"
      onClick={() => {
        unscheduleTask();
        taskAnalytics.sendEvent({ name: "Unschedule" });
      }}
    >
      <Disclaimer>Unschedule</Disclaimer>
    </DropdownItem>,
    <DropdownItem
      data-cy="abort-task"
      key="abort"
      disabled={disabled || !canAbort}
      onClick={() => {
        abortTask();
        taskAnalytics.sendEvent({ name: "Abort" });
      }}
    >
      <Disclaimer>Abort</Disclaimer>
    </DropdownItem>,
    <DropdownItem
      data-cy="disable-enable"
      disabled={disabled}
      onClick={() => {
        setTaskPriority({
          variables: { taskId, priority: initialPriority < 0 ? 0 : -1 },
        });
      }}
    >
      <Disclaimer>{initialPriority < 0 ? "Enable" : "Disable"}</Disclaimer>
    </DropdownItem>,
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title={
        <>
          <StyledBody>Set new priority:</StyledBody>
          <InputNumber
            size="small"
            min={0}
            type="number"
            max={Number.MAX_SAFE_INTEGER}
            value={priority}
            onChange={(val) => setPriority(val as number)}
          />
        </>
      }
      onConfirm={() => {
        setTaskPriority({
          variables: { taskId, priority },
        });
        taskAnalytics.sendEvent({ name: "Set Priority", priority });
      }}
      onCancel={() => setIsVisible(false)}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-task"
        disabled={disabled || !canSetPriority}
        ref={priorityRef}
      >
        <Disclaimer>Set priority</Disclaimer>
      </DropdownItem>
    </Popconfirm>,
  ];

  return (
    <>
      <PageButtonRow ref={wrapperRef}>
        <Button
          size="small"
          data-cy="schedule-task"
          key="schedule"
          disabled={disabled || !canSchedule}
          loading={loadingScheduleTask}
          onClick={() => {
            scheduleTask();
            taskAnalytics.sendEvent({ name: "Schedule" });
          }}
        >
          Schedule
        </Button>
        <Button
          size="small"
          data-cy="restart-task"
          key="restart"
          disabled={disabled || !canRestart}
          loading={loadingRestartTask}
          onClick={() => {
            restartTask();
            taskAnalytics.sendEvent({ name: "Restart" });
          }}
        >
          Restart
        </Button>
        <Button
          size="small"
          data-cy="notify-task"
          key="notifications"
          disabled={disabled}
          onClick={() => {
            taskAnalytics.sendEvent({ name: "Open Notification Modal" });
            setIsVisibleModal(true);
          }}
        >
          Notify Me
        </Button>
        <ButtonDropdown
          disabled={disabled}
          dropdownItems={dropdownItems}
          isVisibleDropdown={isVisible}
          setIsVisibleDropdown={setIsVisible}
          loading={
            loadingUnscheduleTask || loadingAbortTask || loadingSetPriority
          }
        />
      </PageButtonRow>
      <TaskNotificationModal
        visible={isVisibleModal}
        onCancel={() => setIsVisibleModal(false)}
      />
    </>
  );
};

const refetchQueries = ["GetTask"];
const StyledBody = styled(Body)`
  padding-right: 8px;
`;
