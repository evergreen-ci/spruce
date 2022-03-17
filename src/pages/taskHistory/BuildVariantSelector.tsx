import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
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
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
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
        valuePlaceholder="Select Build Variant to View"
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
