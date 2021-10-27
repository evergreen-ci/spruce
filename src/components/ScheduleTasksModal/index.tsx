import { useReducer, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Skeleton } from "antd";
import { Accordion } from "components/Accordion";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables,
} from "gql/generated/types";
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
  const [{ sortedBuildVariantGroups, selectedTasks }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { data, loading } = useQuery<
    GetUndispatchedTasksQuery,
    GetUndispatchedTasksQueryVariables
  >(GET_UNSCHEDULED_TASKS, {
    variables: { versionId },
  });

  useEffect(() => {
    dispatch({ type: "ingestData", taskData: data });
  }, [data]);

  return (
    <ConfirmationModal
      open={open}
      onCancel={() => setOpen(false)}
      title="Schedule Tasks"
      buttonText="Schedule"
    >
      {loading ? (
        <Skeleton />
      ) : (
        sortedBuildVariantGroups.map(
          ({ tasks, buildVariantDisplayName, buildVariant }) => {
            const allTasksSelected = tasks.every(({ id }) =>
              selectedTasks.has(id)
            );
            const someTasksSelected = tasks.some(({ id }) =>
              selectedTasks.has(id)
            );
            return (
              <AccordionWrapper key={buildVariant} data-cy="variant-accordion">
                <Accordion
                  title={
                    <Checkbox
                      data-cy="variant-checkbox"
                      name={buildVariant}
                      label={buildVariantDisplayName}
                      bold
                      checked={allTasksSelected}
                      indeterminate={!allTasksSelected && someTasksSelected}
                      onClick={() => {
                        dispatch({ type: "toggleBuildVariant", buildVariant });
                      }}
                    />
                  }
                  contents={tasks.map(({ id, displayName }) => (
                    <Checkbox
                      key={id}
                      data-cy="task-checkbox"
                      name={id}
                      label={displayName}
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
        )
      )}
    </ConfirmationModal>
  );
};

const AccordionWrapper = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
