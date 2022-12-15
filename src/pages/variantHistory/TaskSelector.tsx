import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import SearchableDropdown from "components/SearchableDropdown";
import {
  GetTaskNamesForBuildVariantQuery,
  GetTaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { GET_TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { HistoryQueryParams } from "types/history";

interface TaskSelectorProps {
  projectId: string;
  buildVariant: string;
}

const TaskSelector: React.VFC<TaskSelectorProps> = ({
  projectId,
  buildVariant,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });

  const [visibleColumns, setVisibleColumns] = useQueryParam<string[]>(
    HistoryQueryParams.VisibleColumns,
    []
  );

  const { data, loading } = useQuery<
    GetTaskNamesForBuildVariantQuery,
    GetTaskNamesForBuildVariantQueryVariables
  >(GET_TASK_NAMES_FOR_BUILD_VARIANT, {
    variables: {
      projectId,
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
      <SearchableDropdown
        label="Tasks"
        valuePlaceholder="Select tasks to view"
        value={visibleColumns}
        onChange={onChange}
        options={taskNamesForBuildVariant}
        disabled={loading}
        allowMultiSelect
      />
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;

export default TaskSelector;
