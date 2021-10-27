import { useReducer, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Accordion } from "components/Accordion";
import { DisplayModal } from "components/DisplayModal";
import {
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables,
} from "gql/generated/types";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";

interface ScheduleTasksModalProps {
  open: boolean;
  setOpen?: (open: boolean) => void;
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
    <DisplayModal
      open={open}
      setOpen={setOpen}
      size="large"
      title="Schedule Tasks"
    >
      {sortedBuildVariantGroups.map(
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
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

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
      )}
    </DisplayModal>
  );
};

interface BVGroupEntry {
  tasks: { id: string; displayName: string }[];
  buildVariantDisplayName: string;
  buildVariant: string;
}
interface BVGroupsInterface {
  [buildVariantKey: string]: BVGroupEntry;
}
interface State {
  sortedBuildVariantGroups: BVGroupEntry[];
  selectedTasks: Set<String>;
}
const initialState: State = {
  sortedBuildVariantGroups: [],
  selectedTasks: new Set(),
};
type Action =
  | { type: "ingestData"; taskData?: GetUndispatchedTasksQuery }
  | { type: "toggleTask"; taskId: string }
  | { type: "toggleBuildVariant"; buildVariant: string };

function reducer(state: State, action: Action): State {
  const { selectedTasks, sortedBuildVariantGroups } = state;
  switch (action.type) {
    case "ingestData":
      return {
        ...state,
        sortedBuildVariantGroups: getSortedBuildVariantGroups(action.taskData),
      };
    case "toggleTask":
      return {
        ...state,
        selectedTasks: toggleItemsById(selectedTasks, [action.taskId]),
      };
    case "toggleBuildVariant":
      return {
        ...state,
        selectedTasks: toggleItemsById(
          selectedTasks,
          sortedBuildVariantGroups
            .find(({ buildVariant }) => action.buildVariant === buildVariant)
            ?.tasks.map(({ id }) => id) ?? []
        ),
      };
    default:
      throw new Error();
  }
}

const getSortedBuildVariantGroups = (data?: GetUndispatchedTasksQuery) => {
  const bvGroups: BVGroupsInterface = data?.patchTasks.tasks.reduce(
    (acc, task) => {
      const { buildVariant, buildVariantDisplayName, displayName, id } = task;
      if (!acc[buildVariant]) {
        acc[buildVariant] = {
          tasks: [{ id, displayName }],
          buildVariantDisplayName,
          buildVariant,
        };
      } else {
        acc[buildVariant].tasks.push({ id, displayName });
      }
      return acc;
    },
    {}
  );
  // sort the build variants
  const sortedBuildVariants = Object.values(bvGroups ?? {}).sort((a, b) =>
    a.buildVariantDisplayName.localeCompare(b.buildVariantDisplayName)
  );
  // sort the tasks
  sortedBuildVariants.forEach(({ tasks }) => {
    tasks.sort((a, b) => a.displayName.localeCompare(b.displayName));
  });

  return sortedBuildVariants;
};

// Add all items to set if some are in set, remove all items from set if all are in set
const toggleItemsById = (set: Set<String>, ids: String[]) => {
  console.log(ids);
  const allInSet = ids.every((id) => set.has(id));
  if (allInSet) {
    ids.forEach((id) => set.delete(id));
  } else {
    ids.forEach((id) => set.add(id));
  }
  return new Set(set);
};

const AccordionWrapper = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
