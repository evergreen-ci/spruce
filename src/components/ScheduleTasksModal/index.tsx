import { useReducer, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Accordion, AccordionWrapper } from "components/Accordion";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useToastContext } from "context/toast";
import {
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS } from "gql/mutations";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import { initialState, reducer } from "./reducer";

interface ScheduleTasksModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  versionId: string;
}
export const ScheduleTasksModal: React.FC<ScheduleTasksModalProps> = ({
  open,
  setOpen,
  versionId,
}) => {
  const [
    { sortedBuildVariantGroups, selectedTasks, allTasks },
    dispatch,
  ] = useReducer(reducer, initialState);
  const closeModal = () => {
    dispatch({ type: "reset" });
    setOpen(false);
  };
  const dispatchToast = useToastContext();
  const [
    scheduleTasks,
    { loading: loadingScheduleTasksMutation },
  ] = useMutation<ScheduleTasksMutation, ScheduleTasksMutationVariables>(
    SCHEDULE_TASKS,
    {
      onCompleted() {
        dispatchToast.success("Tasks scheduled successfully");
        closeModal();
      },
      onError({ message }) {
        dispatchToast.error(`There was an error scheduling tasks: ${message}`);
        closeModal();
      },
    }
  );
  const [
    loadTaskData,
    { data: taskData, loading: loadingTaskData, called: calledTaskData },
  ] = useLazyQuery<
    GetUndispatchedTasksQuery,
    GetUndispatchedTasksQueryVariables
  >(GET_UNSCHEDULED_TASKS, {
    variables: { versionId },
  });
  useEffect(() => {
    if (open && !calledTaskData) {
      loadTaskData();
    }
  }, [calledTaskData, loadTaskData, open]);
  useEffect(() => {
    dispatch({ type: "ingestData", taskData });
  }, [taskData]);

  return (
    <ConfirmationModal
      data-cy="schedule-tasks-modal"
      open={open}
      onCancel={closeModal}
      title="Schedule Tasks"
      buttonText="Schedule"
      submitDisabled={
        loadingTaskData || loadingScheduleTasksMutation || !selectedTasks.size
      }
      onConfirm={() => {
        scheduleTasks({ variables: { taskIds: Array.from(selectedTasks) } });
      }}
    >
      <ContentWrapper>
        {loadingTaskData ? (
          <Skeleton />
        ) : (
          <>
            {sortedBuildVariantGroups.length && (
              <Checkbox
                data-cy="select-all-tasks"
                name="select-all-tasks"
                label="Select all tasks"
                bold
                checked={selectedTasks.size === allTasks.length}
                indeterminate={
                  selectedTasks.size > 0 && selectedTasks.size < allTasks.length
                }
                onClick={() => {
                  dispatch({
                    type: "toggleSelectAll",
                  });
                }}
              />
            )}
            {sortedBuildVariantGroups.map(
              ({ tasks, buildVariantDisplayName, buildVariant }) => {
                const allTasksSelected = tasks.every(({ id }) =>
                  selectedTasks.has(id)
                );
                const someTasksSelected = tasks.some(({ id }) =>
                  selectedTasks.has(id)
                );
                return (
                  <AccordionWrapper
                    key={buildVariant}
                    data-cy="variant-accordion"
                  >
                    <Accordion
                      allowToggleFromTitle={false}
                      title={
                        <Checkbox
                          data-cy={`${buildVariant}-variant-checkbox`}
                          name={buildVariant}
                          label={buildVariantDisplayName}
                          bold
                          checked={allTasksSelected}
                          indeterminate={!allTasksSelected && someTasksSelected}
                          onClick={() => {
                            dispatch({
                              type: "toggleBuildVariant",
                              buildVariant,
                            });
                          }}
                        />
                      }
                      contents={tasks.map(({ id, displayName }) => (
                        <Checkbox
                          key={id}
                          data-cy={`${buildVariant}-${displayName}-task-checkbox`}
                          name={id}
                          label={
                            <span data-cy="task-checkbox-label">
                              {displayName}
                            </span>
                          }
                          bold={false}
                          checked={selectedTasks.has(id)}
                          onClick={() => {
                            dispatch({ type: "toggleTask", taskId: id });
                          }}
                        />
                      ))}
                    />
                  </AccordionWrapper>
                );
              }
            )}
          </>
        )}
        {!loadingTaskData && !sortedBuildVariantGroups.length && (
          <Body>There are no scheduleable tasks.</Body>
        )}
      </ContentWrapper>
    </ConfirmationModal>
  );
};

// 307px represents the height to subtract to prevent an overflow on the modal
const ContentWrapper = styled.div`
  max-height: calc(100vh - 307px);
  overflow-y: auto;
`;
