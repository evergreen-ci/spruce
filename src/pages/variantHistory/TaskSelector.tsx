import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import SearchableDropdown from "components/SearchableDropdown";
import {
  GetBuildVariantHistoryHeadersQuery,
  GetBuildVariantHistoryHeadersQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANT_HISTORY_HEADERS } from "gql/queries";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
interface TaskSelectorProps {
  projectId: string;
  buildVariant: string;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  projectId,
  buildVariant,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  let value = [];
  if (typeof queryParams.tasks === "string") {
    value = [queryParams.tasks];
  } else {
    value = queryParams.tasks;
  }

  const { data, loading } = useQuery<
    GetBuildVariantHistoryHeadersQuery,
    GetBuildVariantHistoryHeadersQueryVariables
  >(GET_BUILD_VARIANT_HISTORY_HEADERS, {
    variables: {
      projectId,
      buildVariant,
    },
  });

  const onChange = (selectedTasks: string[]) => {
    updateQueryParams({
      tasks: selectedTasks,
    });
  };

  const { buildVariantHistoryHeaders } = data || {};
  return (
    <Container>
      <SearchableDropdown
        label="Tasks"
        valuePlaceholder="Select Tasks to View"
        value={value}
        onChange={onChange}
        options={buildVariantHistoryHeaders}
        disabled={loading}
        allowMultiselect
      />
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;
