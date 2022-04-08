import styled from "@emotion/styled";
import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useTaskStatuses } from "hooks";

interface Props {
  versionId: string;
  selectedStatuses: string[];
  selectedBaseStatuses: string[];
  onChangeStatusFilter: (s: string[]) => void;
  onChangeBaseStatusFilter: (s: string[]) => void;
  filterWidth?: string;
}

export const TaskStatusFilters: React.VFC<Props> = ({
  onChangeBaseStatusFilter,
  onChangeStatusFilter,
  versionId,
  selectedBaseStatuses,
  selectedStatuses,
}) => {
  const { currentStatuses, baseStatuses } = useTaskStatuses({ versionId });
  return (
    <>
      <SelectorWrapper>
        <Dropdown
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
        </Dropdown>
      </SelectorWrapper>
      <SelectorWrapper>
        <Dropdown
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
        </Dropdown>
      </SelectorWrapper>
    </>
  );
};

const SelectorWrapper = styled.div`
  width: 50%;
`;
