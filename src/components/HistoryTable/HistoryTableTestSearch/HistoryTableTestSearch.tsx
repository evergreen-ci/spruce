import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import TextInput from "@leafygreen-ui/text-input";
import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, url } from "utils";

const { upsertQueryParam } = url;
const { parseQueryString } = queryString;
export interface HistoryTableTestSearchAnalytics {
  failedTests: string[];
}
interface HistoryTableTestSearchProps {
  onSubmit?: (failedTests: string[]) => void;
}

export const HistoryTableTestSearch = ({
  onSubmit = () => {},
}: HistoryTableTestSearchProps): JSX.Element => {
  const [input, setInput] = useState("");

  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  // Currently, users are only able to filter by failed tests
  const onClick = () => {
    const selectedParams = queryParams.failed as string[];
    const updatedParams = upsertQueryParam(selectedParams, input);
    onSubmit(updatedParams);
    updateQueryParams({ failed: updatedParams });
    setInput("");
  };

  return (
    <ContentWrapper>
      <TextInputWrapper>
        <TextInput
          type="search"
          label="Filter by Failed Tests"
          aria-label="history-table-test-search-input"
          value={input}
          placeholder="Search Test Name"
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onClick()}
        />
        <StyledIcon glyph="Plus" onClick={() => onClick()} />
      </TextInputWrapper>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 200px; //temporary
  padding-right: 30px;
`;

const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  height: 100%;
  top: 10px; //temporary
  align-self: flex-end;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
