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
import { ButtonRow } from "components/ButtonRow";

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
import { uiColors } from "@leafygreen-ui/palette";
interface Props {
  priority?: number;
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
  ...props
}: Props) => {
  const { success, error } = useBannerDispatchContext();
  const wrapperRef = useRef(null);
  const priorityRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [priority, setPriority] = useState<number>(props.priority);
  const { id: taskId } = useParams<{ id: string }>();

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTaskMutation,
    ScheduleTaskMutationVariables
  >(SCHEDULE_TASK, {
    variables: { taskId },
    onCompleted: () => {
      success("Task marked as scheduled");
    },
    onError: (err) => {
      error(`Error scheduling task: ${err.message}`);
    },
  });

  const [unscheduleTask, { loading: loadingUnscheduleTask }] = useMutation<
    UnscheduleTaskMutation,
    UnscheduleTaskMutationVariables
  >(UNSCHEDULE_TASK, {
    variables: { taskId },
    onCompleted: () => {
      success("Task marked as unscheduled");
    },
    onError: (err) => {
      error(`Error unscheduling task: ${err.message}`);
    },
  });

  const [abortTask, { loading: loadingAbortTask }] = useMutation<
    AbortTaskMutation,
    AbortTaskMutationVariables
  >(ABORT_TASK, {
    variables: {
      taskId,
    },
    onCompleted: () => {
      success("Task aborted");
    },
    onError: (err) => {
      error(`Error aborting task: ${err.message}`);
    },
  });

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    variables: { taskId },
    onCompleted: () => {
      success("Task scheduled to restart");
    },
    onError: (err) => {
      error(`Error restarting task: ${err.message}`);
    },
  });

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORTY, {
    onCompleted: (data) => {
      success(`Priority for task updated to ${data.setTaskPriority.priority}`);
    },
    onError: (err) => {
      error(`Error updating priority for task: ${err.message}`);
    },
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
  }, [disabled]);

  useOnClickOutside(wrapperRef, () => {
    if (
      !get(priorityRef, "current.className", "").includes("ant-popover-open")
    ) {
      setIsVisible(false);
    }
  });

  const rowButtons = [
    <Button
      dataCy="schedule-task"
      key="schedule"
      disabled={disabled || !canSchedule}
      loading={loadingScheduleTask}
      onClick={scheduleTask}
    >
      Schedule
    </Button>,
    <Button
      dataCy="restart-task"
      key="restart"
      disabled={disabled || !canRestart}
      loading={loadingRestartTask}
      onClick={restartTask}
    >
      Restart
    </Button>,
    <Button dataCy="notify-task" key="notifications" disabled={disabled}>
      Add Notification
    </Button>,
  ];

  const cardItems = [
    <Item
      disabled={disabled || !canUnschedule}
      key="unschedule"
      data-cy="unschedule-task"
      onClick={() => unscheduleTask()}
    >
      <Body>Unschedule</Body>
    </Item>,
    <Item
      data-cy="abort-task"
      key="abort"
      disabled={disabled || !canAbort}
      onClick={() => abortTask()}
    >
      <Body>Abort</Body>
    </Item>,
    <Popconfirm
      key="priority"
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
      <Item
        data-cy="prioritize-task"
        disabled={disabled || !canSetPriority}
        ref={priorityRef}
        style={{ paddingRight: 8 }}
      >
        <Body>Set priority</Body>
      </Item>
    </Popconfirm>,
  ];

  return (
    <ButtonRow
      containerRef={wrapperRef}
      rowButtons={rowButtons}
      cardItems={cardItems}
      cardLoading={
        loadingUnscheduleTask || loadingAbortTask || loadingSetPriority
      }
      cardDisabled={disabled}
      setIsVisibleCard={setIsVisible}
      isVisibleCard={isVisible}
    />
  );
};

interface ItemProps {
  disabled: boolean;
}
const Item = styled.div`
  > p:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  pointer-events:${(props: ItemProps) => props.disabled && "none"}; 
  > p {
    color: ${(props: ItemProps) => props.disabled && uiColors.gray.base};
`;

const StyledBody = styled(Body)`
  padding-right: 8px;
`;
