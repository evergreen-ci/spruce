import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import SearchableDropdown, {
  SearchableDropdownOption,
} from "components/SearchableDropdown";
import {
  GetBuildVariantsForTaskNameQuery,
  GetBuildVariantsForTaskNameQueryVariables,
  BuildVariantTuple,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_FOR_TASK_NAME } from "gql/queries";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { HistoryQueryParams } from "types/history";
import { queryString, array } from "utils";

const { toArray } = array;
const { parseQueryString } = queryString;
interface BuildVariantSelectorProps {
  projectId: string;
  taskName: string;
}

const BuildVariantSelector: React.VFC<BuildVariantSelectorProps> = ({
  projectId,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const value = useMemo(
    () => toArray(queryParams[HistoryQueryParams.VisibleColumns]) as unknown[],
    [queryParams]
  ); // This component will be replaced by the ComboBox in the future.

  const { data, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectId,
      taskName,
    },
  });

  const onChange = (selectedBuildVariants: string[]) => {
    sendEvent({
      name: "Filter by build variant",
    });
    updateQueryParams({
      [HistoryQueryParams.VisibleColumns]: selectedBuildVariants,
    });
  };

  const { buildVariantsForTaskName } = data || {};

  const handleSearch = (options: BuildVariantTuple[], match: string) =>
    options.filter(
      (option) =>
        option.buildVariant.includes(match) ||
        option.displayName.includes(match)
    );
  return (
    <Container>
      <SearchableDropdown
        data-cy="build-variant-selector"
        label="Build Variant"
        valuePlaceholder="Select build variant to view"
        value={value}
        onChange={onChange}
        options={buildVariantsForTaskName}
        disabled={loading}
        allowMultiSelect
        searchFunc={handleSearch}
        optionRenderer={(option: BuildVariantTuple, onClick, isChecked) => (
          <SearchableDropdownOption
            key={`searchable_dropdown_option_${option.buildVariant}`}
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

export default BuildVariantSelector;
