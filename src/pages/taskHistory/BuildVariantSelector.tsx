import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import SearchableDropdown from "components/SearchableDropdown";
import {
  GetTaskHistoryQuery,
  GetTaskHistoryQueryVariables,
} from "gql/generated/types";
import { GET_TASK_HISTORY } from "gql/queries";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
interface BuildVariantSelectorProps {
  projectId: string;
  taskName: string;
}

export const BuildVariantSelector: React.FC<BuildVariantSelectorProps> = ({
  projectId,
  taskName,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  let value = [];
  if (typeof queryParams.buildVariants === "string") {
    value = [queryParams.buildVariants];
  } else {
    value = queryParams.buildVariants;
  }

  const { data, loading } = useQuery<
    GetTaskHistoryQuery,
    GetTaskHistoryQueryVariables
  >(GET_TASK_HISTORY, {
    variables: {
      projectId,
      taskName,
    },
  });

  const onChange = (selectedBuildVariants: string[]) => {
    updateQueryParams({
      buildVariants: selectedBuildVariants,
    });
  };

  const { taskHistory } = data || {};
  return (
    <Container>
      <SearchableDropdown
        label="Build Variant"
        valuePlaceholder="Select Build Variant to View"
        value={value}
        onChange={onChange}
        options={taskHistory}
        disabled={loading}
        allowMultiselect
      />
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;
