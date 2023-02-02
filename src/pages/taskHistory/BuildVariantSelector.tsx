import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
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
import { useQueryParam } from "hooks/useQueryParam";
import { HistoryQueryParams } from "types/history";

interface BuildVariantSelectorProps {
  projectIdentifier: string;
  taskName: string;
}

const BuildVariantSelector: React.VFC<BuildVariantSelectorProps> = ({
  projectIdentifier,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const [visibleColumns, setVisibleColumns] = useQueryParam(
    HistoryQueryParams.VisibleColumns,
    []
  );

  const { data, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectIdentifier,
      taskName,
    },
  });

  const onChange = (selectedBuildVariants: string[]) => {
    sendEvent({
      name: "Filter by build variant",
    });

    setVisibleColumns(selectedBuildVariants);
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
        value={visibleColumns}
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
