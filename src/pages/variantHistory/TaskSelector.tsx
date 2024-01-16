import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { HistoryQueryParams } from "types/history";

interface TaskSelectorProps {
  projectIdentifier: string;
  buildVariant: string;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({
  buildVariant,
  projectIdentifier,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });

  const [visibleColumns, setVisibleColumns] = useQueryParam<string[]>(
    HistoryQueryParams.VisibleColumns,
    [],
  );

  const { data, loading } = useQuery<
    TaskNamesForBuildVariantQuery,
    TaskNamesForBuildVariantQueryVariables
  >(TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectIdentifier,
      buildVariant,
    },
  });

  const onChange = (selectedTasks: string[]) => {
    sendEvent({
      name: "Filter by task",
    });

    setVisibleColumns(selectedTasks);
  };

  const { taskNamesForBuildVariant } = data || {};

  return (
    <Container>
      <Combobox
        data-cy="task-selector"
        label="Tasks"
        placeholder="Select tasks"
        value={visibleColumns}
        multiselect
        onChange={onChange}
        disabled={loading}
        overflow="scroll-x"
      >
        {taskNamesForBuildVariant?.map((taskName) => (
          <ComboboxOption key={taskName} value={taskName} />
        ))}
      </Combobox>
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;

export default TaskSelector;
