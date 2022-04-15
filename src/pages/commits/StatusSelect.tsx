import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Dropdown from "components/Dropdown";
import { TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { taskStatusesFilterTreeData } from "constants/task";
import { useStatusesFilter } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const StatusSelect = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const { inputValue, setAndSubmitInputValue } = useStatusesFilter({
    urlParam: PatchTasksQueryParams.Statuses,
    sendAnalyticsEvent: (_, filterValue: string[]) => {
      sendEvent({
        name: "Filter by task status",
        statuses: filterValue,
      });
    },
  });
  return (
    <Container>
      <Label htmlFor="project-task-status-select">Status</Label>
      <Dropdown
        data-cy="project-task-status-select"
        buttonText={`Task Status: ${
          inputValue.length ? inputValue.join(", ") : noFilterMessage
        }`}
      >
        <TreeSelect
          onChange={setAndSubmitInputValue}
          tData={taskStatusesFilterTreeData}
          state={inputValue}
          hasStyling={false}
        />
      </Dropdown>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
