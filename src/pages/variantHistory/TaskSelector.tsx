import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import SearchableDropdown from "components/SearchableDropdown";
import {
  GetBuildVariantHistoryQuery,
  GetBuildVariantHistoryQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANT_HISTORY } from "gql/queries";
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
    GetBuildVariantHistoryQuery,
    GetBuildVariantHistoryQueryVariables
  >(GET_BUILD_VARIANT_HISTORY, {
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

  const { buildVariantHistory } = data || {};
  return (
    <Container>
      <SearchableDropdown
        label="Tasks"
        valuePlaceholder="Select Tasks to View"
        value={value}
        onChange={onChange}
        options={buildVariantHistory}
        disabled={loading}
        allowMultiselect
      />
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;
