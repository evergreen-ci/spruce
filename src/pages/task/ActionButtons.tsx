import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { Popconfirm } from "antd";
import { useParams } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { Link } from "components/Link";
import { PageButtonRow } from "components/styles";
import { commitQueueRequester } from "constants/patch";
import { getTaskHistoryRoute } from "constants/routes";
import { mergeTaskName } from "constants/task";
import { useToastContext } from "context/toast";
import {
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
  AbortTaskMutation,
  AbortTaskMutationVariables,
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
  UnscheduleTaskMutation,
  UnscheduleTaskMutationVariables,
  OverrideTaskDependenciesMutation,
  OverrideTaskDependenciesMutationVariables,
  GetTaskQuery,
} from "gql/generated/types";
import {
  ABORT_TASK,
  OVERRIDE_TASK_DEPENDENCIES,
  RESTART_TASK,
  SCHEDULE_TASKS,
  SET_TASK_PRIORTY,
  UNSCHEDULE_TASK,
} from "gql/mutations";
import { useUpdateURLQueryParams } from "hooks";
import { PreviousCommits } from "./actionButtons/previousCommits/PreviousCommits";
import { TaskNotificationModal } from "./actionButtons/TaskNotificationModal";

interface Props {
  initialPriority?: number;
  isExecutionTask: boolean;
  task: GetTaskQuery["task"];
}

export const ActionButtons: React.VFC<Props> = ({
  initialPriority = 1,
  task,
  isExecutionTask,
}) => {
  const {
    canAbort,
    canUnschedule,
    canRestart,
    canSetPriority,
    canOverrideDependencies,
    displayName,
    project,
    requester,
    canSchedule,
    versionMetadata,
  } = task || {};

  const { isPatch, order } = versionMetadata || {};
  const { identifier: projectIdentifier } = project || {};
  const isPatchOnCommitQueue = requester === commitQueueRequester;

  const dispatchToast = useToastContext();
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [priority, setPriority] = useState<number>(initialPriority);
  const { id: taskId } = useParams<{ id: string }>();
  const taskAnalytics = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();

  const [scheduleTask, { loading: loadingScheduleTask }] = useMutation<
    ScheduleTasksMutation,
    ScheduleTasksMutationVariables
  >(SCHEDULE_TASKS, {
    variables: { taskIds: [taskId] },
    onCompleted: () => {
      dispatchToast.success("Task marked as scheduled");
    },
    onError: (err) => {
      dispatchToast.error(`Error scheduling task: ${err.message}`);
    },
  });

  const [unscheduleTask, { loading: loadingUnscheduleTask }] = useMutation<
    UnscheduleTaskMutation,
    UnscheduleTaskMutationVariables
  >(UNSCHEDULE_TASK, {
    variables: { taskId },
    onCompleted: () => {
      dispatchToast.success("Task marked as unscheduled");
    },
    onError: (err) => {
      dispatchToast.error(`Error unscheduling task: ${err.message}`);
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
      dispatchToast.success("Task aborted");
    },
    onError: (err) => {
      dispatchToast.error(`Error aborting task: ${err.message}`);
    },
  });

  const [restartTask, { loading: loadingRestartTask }] = useMutation<
    RestartTaskMutation,
    RestartTaskMutationVariables
  >(RESTART_TASK, {
    variables: { taskId },
    onCompleted: (data) => {
      const { latestExecution } = data.restartTask;
      dispatchToast.success("Task scheduled to restart");
      updateQueryParams({
        execution: `${latestExecution}`,
      });
    },
    onError: (err) => {
      dispatchToast.error(`Error restarting task: ${err.message}`);
    },
  });

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORTY, {
    onCompleted: (data) => {
      dispatchToast.success(
        data.setTaskPriority.priority >= 0
          ? `Priority for task updated to ${data.setTaskPriority.priority}`
          : `Task was successfully disabled`
      );
    },
    onError: (err) => {
      dispatchToast.error(`Error updating priority for task: ${err.message}`);
    },
  });

  const [
    overrideTaskDependencies,
    { loading: loadingOverrideTaskDependencies },
  ] = useMutation<
    OverrideTaskDependenciesMutation,
    OverrideTaskDependenciesMutationVariables
  >(OVERRIDE_TASK_DEPENDENCIES, {
    onCompleted: () => {
      dispatchToast.success("Successfully overrode task dependencies");
    },
    onError: (err) => {
      dispatchToast.error(`Error overriding task dependencies: ${err.message}`);
    },
  });

  const disabled =
    loadingAbortTask ||
    loadingRestartTask ||
    loadingSetPriority ||
    loadingUnscheduleTask ||
    loadingScheduleTask ||
    loadingOverrideTaskDependencies;

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
      Unschedule
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
      Abort
    </DropdownItem>,
    <DropdownItem
      data-cy="disable-enable"
      disabled={disabled}
      key="disableTask"
      onClick={() => {
        setTaskPriority({
          variables: { taskId, priority: initialPriority < 0 ? 0 : -1 },
        });
      }}
    >
      {initialPriority < 0 ? "Enable" : "Disable"}
    </DropdownItem>,
    <ConditionalWrapper
      key="taskPriorityWrapper"
      condition={canSetPriority}
      wrapper={(children) => (
        <Popconfirm
          key="priority"
          icon={null}
          placement="left"
          title={
            <TextInput
              label="Set new priority"
              size={1}
              min={0}
              type="number"
              value={priority.toString()}
              onChange={(e) => setPriority(parseInt(e.target.value, 10))}
              data-cy="task-priority-input"
              autoFocus
            />
          }
          onConfirm={() => {
            setTaskPriority({
              variables: { taskId, priority },
            });
            taskAnalytics.sendEvent({ name: "Set Priority", priority });
          }}
          okText="Set"
          cancelText="Cancel"
        >
          {children}
        </Popconfirm>
      )}
    >
      <DropdownItem
        data-cy="prioritize-task"
        disabled={disabled || !canSetPriority}
        key="setTaskPriority"
      >
        Set priority
      </DropdownItem>
    </ConditionalWrapper>,
    <DropdownItem
      data-cy="override-dependencies"
      disabled={disabled || !canOverrideDependencies}
      key="overrideDependencies"
      onClick={() => {
        overrideTaskDependencies({ variables: { taskId } });
      }}
    >
      Override Dependencies
    </DropdownItem>,
  ];

  return (
    <>
      <PageButtonRow>
        {!isExecutionTask && (
          <>
            <PreviousCommits taskId={taskId} />
            <Button
              size="small"
              data-cy="task-history"
              key="task-history"
              onClick={() => {
                taskAnalytics.sendEvent({ name: "Click See History Button" });
              }}
              as={Link}
              data-to={getTaskHistoryRoute(projectIdentifier, displayName, {
                selectedCommit: !isPatch && order,
              })}
              disabled={displayName === mergeTaskName}
            >
              See history
            </Button>
          </>
        )}
        <LoadingButton
          size="small"
          data-cy="schedule-task"
          key="schedule"
          disabled={disabled || !canSchedule || isPatchOnCommitQueue}
          loading={loadingScheduleTask}
          onClick={() => {
            scheduleTask();
            taskAnalytics.sendEvent({ name: "Schedule" });
          }}
        >
          Schedule
        </LoadingButton>
        <LoadingButton
          size="small"
          data-cy="restart-task"
          key="restart"
          disabled={disabled || !canRestart || isPatchOnCommitQueue}
          loading={loadingRestartTask}
          onClick={() => {
            restartTask();
            taskAnalytics.sendEvent({ name: "Restart" });
          }}
        >
          Restart
        </LoadingButton>
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
