import styled from "@emotion/styled";
import { Label } from "@leafygreen-ui/typography";
import { useLocation } from "react-router-dom";
import DropdownButton from "components/DropdownButton";
import { ALL_VALUE, TreeSelect } from "components/TreeSelect";
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
    title: "RepoTracker",
    key: CommitRequesterTypes.RepotrackerVersionRequester,
  },
  {
    value: CommitRequesterTypes.GitTagRequester,
    title: "Git Tag",
    key: CommitRequesterTypes.GitTagRequester,
  },
  {
    value: CommitRequesterTypes.TriggerRequester,
    title: "Trigger",
    key: CommitRequesterTypes.TriggerRequester,
  },
];

const CommitTypeSelector = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const selectedRequesters = toArray(
    queryParams[MainlineCommitQueryParams.Requester]
  );
  const onChange = (value: string[]) => {
    updateQueryParams({ [MainlineCommitQueryParams.Requester]: value });
  };

  return (
    <Container>
      <Label htmlFor="requester-select">Requesters</Label>
      <DropdownButton
        data-cy="requester-select"
        buttonText={`Requesters: ${selectedRequesters.join(", ")}`}
      >
        <TreeSelect
          onChange={onChange}
          tData={TreeData}
          state={selectedRequesters}
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

export default CommitTypeSelector;
