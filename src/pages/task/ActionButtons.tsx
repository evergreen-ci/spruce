import React, { useRef, useState, useEffect } from "react";
import { Button } from "components/Button";
import styled from "@emotion/styled";
import { useOnClickOutside } from "hooks";
import { InputNumber, Popconfirm } from "antd";
import get from "lodash/get";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { ABORT_TASK } from "gql/mutations/abort-task";
import { RESTART_TASK } from "gql/mutations/restart-task";
import { SCHEDULE_TASK } from "gql/mutations/schedule-task";
import { UNSCHEDULE_TASK } from "gql/mutations/unschedule-task";
import { SET_TASK_PRIORTY } from "gql/mutations/set-task-priority";
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
import { PageButtonRow } from "components/styles";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { TaskNotificationModal } from "pages/task/actionButtons/TaskNotificationModal";

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
    onCompleted: () => {
      successBanner("Task scheduled to restart");
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
        `Priority for task updated to ${data.setTaskPriority.priority}`
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
      onClick={() => unscheduleTask()}
    >
      <Body>Unschedule</Body>
    </DropdownItem>,
    <DropdownItem
      data-cy="abort-task"
      key="abort"
      disabled={disabled || !canAbort}
      onClick={() => abortTask()}
    >
      <Body>Abort</Body>
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
            onChange={setPriority}
          />
        </>
      }
      onConfirm={() =>
        setTaskPriority({
          variables: { taskId, priority },
        })
      }
      onCancel={() => setIsVisible(false)}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-task"
        disabled={disabled || !canSetPriority}
        ref={priorityRef}
      >
        <Body>Set priority</Body>
      </DropdownItem>
    </Popconfirm>,
  ];

  return (
    <>
      <PageButtonRow ref={wrapperRef}>
        <Button
          size="small"
          dataCy="schedule-task"
          key="schedule"
          disabled={disabled || !canSchedule}
          loading={loadingScheduleTask}
          onClick={scheduleTask}
        >
          Schedule
        </Button>
        <Button
          size="small"
          dataCy="restart-task"
          key="restart"
          disabled={disabled || !canRestart}
          loading={loadingRestartTask}
          onClick={restartTask}
        >
          Restart
        </Button>
        <Button
          size="small"
          dataCy="notify-task"
          key="notifications"
          disabled={disabled}
          onClick={() => setIsVisibleModal(!isVisibleModal)}
        >
          Add Notification
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
