import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import SearchableDropdown, {
  SearchableDropdownOption,
} from "components/SearchableDropdown";
import {
  GetTaskHistoryHeadersQuery,
  GetTaskHistoryHeadersQueryVariables,
  TaskHistoryBuildVariantHeader,
} from "gql/generated/types";
import { GET_TASK_HISTORY_HEADERS } from "gql/queries";
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
    GetTaskHistoryHeadersQuery,
    GetTaskHistoryHeadersQueryVariables
  >(GET_TASK_HISTORY_HEADERS, {
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

  const { taskHistoryHeaders } = data || {};
  return (
    <Container>
      <SearchableDropdown
        label="Build Variant"
        valuePlaceholder="Select Build Variant to View"
        value={value}
        onChange={onChange}
        options={taskHistoryHeaders}
        disabled={loading}
        allowMultiselect
        optionRenderer={(
          option: TaskHistoryBuildVariantHeader,
          onClick,
          isChecked
        ) => (
          <SearchableDropdownOption
            value={option.buildVariant}
            displayName={option.displayName}
            onClick={() => onClick(option.buildVariant)}
            isChecked={isChecked(option.buildVariant)}
          />
        )}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;
