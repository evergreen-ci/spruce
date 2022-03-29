import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import { useLocation } from "react-router";
import { size } from "constants/tokens";
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

const TaskSelector: React.FC<TaskSelectorProps> = ({
  projectId,
  buildVariant,
}) => {
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
  const taskNames = data?.taskNamesForBuildVariant ?? [];

  const onChange = (selectedTasks: string[]) => {
    updateQueryParams({
      [HistoryQueryParams.VisibleColumns]: selectedTasks,
    });
  };

  return (
    <StyledCombobox
      data-cy="task-selector"
      label="Tasks"
      placeholder="Select Tasks to View"
      disabled={loading}
      overflow="scroll-x"
      multiselect
      onChange={onChange}
      value={value}
      clearable
    >
      {taskNames.map((name) => (
        <ComboboxOption
          key={`combobox_option_${name}`}
          data-cy="combobox-option"
          value={name}
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

export default TaskSelector;
