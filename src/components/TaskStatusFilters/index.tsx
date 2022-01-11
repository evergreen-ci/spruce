import styled from "@emotion/styled";
import DropdownButton from "components/DropdownButton";
import { TreeSelect } from "components/TreeSelect";
import { useTaskStatuses } from "hooks";

interface Props {
  versionId: string;
  selectedStatuses: string[];
  selectedBaseStatuses: string[];
  onChangeStatusFilter: (s: string[]) => void;
  onChangeBaseStatusFilter: (s: string[]) => void;
  filterWidth?: string;
}

export const TaskStatusFilters: React.FC<Props> = ({
  onChangeBaseStatusFilter,
  onChangeStatusFilter,
  versionId,
  selectedBaseStatuses,
  selectedStatuses,
}) => {
  const { currentStatuses, baseStatuses } = useTaskStatuses({ versionId });
  const noFilterMessage = "No filters selected";
  return (
    <>
      <SelectorWrapper>
        <DropdownButton
          data-cy="task-status-filter"
          buttonText={`Task Status: ${
            selectedStatuses.length
              ? selectedStatuses.join(", ")
              : noFilterMessage
          }`}
        >
          <TreeSelect
            state={selectedStatuses}
            tData={currentStatuses}
            onChange={onChangeStatusFilter}
            hasStyling={false}
          />
        </DropdownButton>
      </SelectorWrapper>
      <SelectorWrapper>
        <DropdownButton
          data-cy="base-task-status-filter"
          buttonText={`Base Task Status: ${
            selectedBaseStatuses.length
              ? selectedBaseStatuses.join(", ")
              : noFilterMessage
          }`}
        >
          <TreeSelect
            state={selectedBaseStatuses}
            tData={baseStatuses}
            onChange={onChangeBaseStatusFilter}
            hasStyling={false}
          />
        </DropdownButton>
      </SelectorWrapper>
    </>
  );
};

const SelectorWrapper = styled.div`
  width: 50%;
`;
