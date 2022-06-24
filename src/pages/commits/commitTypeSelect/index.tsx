import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import { useLocation } from "react-router-dom";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Dropdown from "components/Dropdown";
import { ALL_VALUE, TreeSelect } from "components/TreeSelect";
import { noFilterMessage } from "constants/strings";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { CommitRequesterTypes, MainlineCommitQueryParams } from "types/commits";
import { queryString, array } from "utils";

const { parseQueryString } = queryString;
const { toArray } = array;

const TreeData = [
  {
    title: "All",
    value: ALL_VALUE,
    key: ALL_VALUE,
  },
  {
    value: CommitRequesterTypes.RepotrackerVersionRequester,
    title: "Commits",
    key: CommitRequesterTypes.RepotrackerVersionRequester,
  },
  {
    value: CommitRequesterTypes.GitTagRequester,
    title: "Git Tags",
    key: CommitRequesterTypes.GitTagRequester,
  },
  {
    value: CommitRequesterTypes.TriggerRequester,
    title: "Triggers",
    key: CommitRequesterTypes.TriggerRequester,
  },
  {
    value: CommitRequesterTypes.AdHocRequester,
    title: "Periodic Build",
    key: CommitRequesterTypes.AdHocRequester,
  },
];

const CommitTypeSelector = () => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const selectedRequesters = toArray(
    queryParams[MainlineCommitQueryParams.Requester]
  );
  const onChange = (value: string[]) => {
    updateQueryParams({ [MainlineCommitQueryParams.Requester]: value });
    sendEvent({ name: "Filter by requester", requesters: value });
  };

  return (
    <Container>
      <Label htmlFor="requester-select">Requesters</Label>
      <Dropdown
        data-cy="requester-select"
        buttonText={`Requesters: ${
          selectedRequesters.length
            ? selectedRequesters.join(", ")
            : noFilterMessage
        }`}
      >
        <TreeSelect
          onChange={onChange}
          tData={TreeData}
          state={selectedRequesters}
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

export default CommitTypeSelector;
