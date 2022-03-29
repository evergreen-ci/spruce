import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useLocation } from "react-router";
import { size } from "constants/tokens";
import {
  GetBuildVariantsForTaskNameQuery,
  GetBuildVariantsForTaskNameQueryVariables,
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

const BuildVariantSelector: React.FC<BuildVariantSelectorProps> = ({
  projectId,
  taskName,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const value = useMemo(
    () => toArray(queryParams[HistoryQueryParams.VisibleColumns]),
    [queryParams]
  );

  const { data, loading } = useQuery<
    GetBuildVariantsForTaskNameQuery,
    GetBuildVariantsForTaskNameQueryVariables
  >(GET_BUILD_VARIANTS_FOR_TASK_NAME, {
    variables: {
      projectId,
      taskName,
    },
  });
  const buildVariants = data?.buildVariantsForTaskName ?? [];

  const onChange = (selectedBuildVariants: string[]) => {
    updateQueryParams({
      [HistoryQueryParams.VisibleColumns]: selectedBuildVariants,
    });
  };

  return (
    <StyledCombobox
      data-cy="build-variant-selector"
      label="Build Variant"
      placeholder="Select Build Variant to View"
      disabled={loading}
      overflow="scroll-x"
      multiselect
      onChange={onChange}
      value={value}
      clearable
    >
      {buildVariants.map(({ displayName, buildVariant }) => (
        <ComboboxOption
          key={`combobox_option_${buildVariant}`}
          data-cy="combobox-option"
          value={buildVariant}
          displayName={displayName}
        />
      ))}
    </StyledCombobox>
  );
};

const StyledCombobox = styled(Combobox)`
  width: 350px;
  [role="option"]:first-of-type {
    margin-left: ${size.xs};
  }
`;

export default BuildVariantSelector;
