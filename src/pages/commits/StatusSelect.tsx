import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import DropdownButton from "components/DropdownButton";
import { TreeSelect } from "components/TreeSelect";
import { taskStatusesFilterTreeData } from "constants/task";
import { useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const StatusSelect = () => {
  const { inputValue, setAndSubmitInputValue } = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
  });
  return (
    <Container>
      <Label htmlFor="project-test-status-select">Status</Label>
      <DropdownButton
        data-cy="project-test-status-select-button"
        buttonText={`Task Status: ${inputValue.join(", ")}`}
      >
        <TreeSelect
          onChange={setAndSubmitInputValue}
          tData={taskStatusesFilterTreeData}
          state={inputValue}
          data-cy="project-test-status-select"
          hasStyling={false}
        />
      </DropdownButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
