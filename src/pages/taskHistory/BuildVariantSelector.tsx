import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import {
  BuildVariantsForTaskNameQuery,
  BuildVariantsForTaskNameQueryVariables,
} from "gql/generated/types";
import { BUILD_VARIANTS_FOR_TASK_NAME } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { HistoryQueryParams } from "types/history";

interface BuildVariantSelectorProps {
  projectIdentifier: string;
  taskName: string;
}

const BuildVariantSelector: React.FC<BuildVariantSelectorProps> = ({
  projectIdentifier,
  taskName,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Task history" });
  const [visibleColumns, setVisibleColumns] = useQueryParam(
    HistoryQueryParams.VisibleColumns,
    [],
  );

  const { data, loading } = useQuery<
    BuildVariantsForTaskNameQuery,
    BuildVariantsForTaskNameQueryVariables
  >(BUILD_VARIANTS_FOR_TASK_NAME, {
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

  return (
    <Container>
      <Combobox
        data-cy="build-variant-selector"
        label="Build Variant"
        placeholder="Select build variants"
        value={visibleColumns}
        multiselect
        onChange={onChange}
        disabled={loading}
        overflow="scroll-x"
      >
        {buildVariantsForTaskName?.map((option) => (
          <ComboboxOption
            key={`searchable_dropdown_option_${option.buildVariant}`}
            value={option.buildVariant}
            displayName={option.displayName}
          />
        ))}
      </Combobox>
    </Container>
  );
};

const Container = styled.div`
  width: 300px;
`;

export default BuildVariantSelector;
