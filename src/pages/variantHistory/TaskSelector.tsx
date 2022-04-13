import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import SearchableDropdown from "components/SearchableDropdown";
import {
  GetTaskNamesForBuildVariantQuery,
  GetTaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { GET_TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { HistoryQueryParams } from "types/history";
import { queryString, array } from "utils";

const { toArray } = array;
const { parseQueryString } = queryString;
interface TaskSelectorProps {
  projectId: string;
  buildVariant: string;
}

const TaskSelector: React.VFC<TaskSelectorProps> = ({
  projectId,
  buildVariant,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Variant history" });
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const value = useMemo(
    () => toArray(queryParams[HistoryQueryParams.VisibleColumns]),
    [queryParams]
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
    updateQueryParams({
      [HistoryQueryParams.VisibleColumns]: selectedTasks,
    });
  };

  const { taskNamesForBuildVariant } = data || {};
  return (
    <Container>
      <SearchableDropdown
        label="Tasks"
        valuePlaceholder="Select Tasks to View"
        value={value}
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
