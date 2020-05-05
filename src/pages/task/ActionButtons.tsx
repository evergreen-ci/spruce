import React, { useRef, useState, useEffect } from "react";
import { Button } from "components/Button";
import { EllipsisBtnCopy } from "components/styles/Button";
import styled from "@emotion/styled";
import { useOnClickOutside, usePrevious } from "hooks";
import Card from "@leafygreen-ui/card";
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
interface Props {
  priority?: number;
}

export const ActionButtons = (props: Props) => {
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
    onCompleted: () => success("Task scheduled to restart"),
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

  const toggleOptions = () => setIsVisible(!isVisible);
  const onChange = (p: number) => {
    setPriority(p);
  };

  return (
    <Container ref={wrapperRef}>
      <Button
        disabled={disabled}
        loading={loadingScheduleTask}
        onClick={scheduleTask}
      >
        Schedule
      </Button>
      <Button
        disabled={disabled}
        loading={loadingRestartTask}
        onClick={restartTask}
      >
        Restart
      </Button>
      <Button disabled={disabled}>Add Notification</Button>
      <div>
        <Button
          disabled={disabled}
          loading={
            loadingUnscheduleTask || loadingAbortTask || loadingSetPriority
          }
          onClick={toggleOptions}
        >
          <EllipsisBtnCopy>...</EllipsisBtnCopy>
        </Button>
        {isVisible && (
          <Options>
            <Item onClick={() => unscheduleTask()}>
              <Body>Unschedule</Body>
            </Item>
            <Item onClick={() => abortTask()}>
              <Body>Abort</Body>
            </Item>
            <Popconfirm
              placement="left"
              title={
                <>
                  <StyledBody>Set new priority:</StyledBody>
                  <InputNumber
                    size="small"
                    min={1}
                    type="number"
                    max={100000}
                    value={priority}
                    onChange={onChange}
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
              <Item ref={priorityRef} style={{ paddingRight: 8 }}>
                <Body>Set priority</Body>
              </Item>
            </Popconfirm>
          </Options>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  > button {
    margin-right: 8px;
  }
  display: flex;
`;

const Options = styled(Card)`
  position: absolute;
  right: 8px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;

const Item = styled.div`
  > p:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const StyledBody = styled(Body)`
  padding-right: 8px;
`;
