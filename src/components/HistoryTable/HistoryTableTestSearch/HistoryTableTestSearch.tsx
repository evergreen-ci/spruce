import { useState } from "react";
import styled from "@emotion/styled";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Input } from "antd";
import { useLocation } from "react-router-dom";
import Icon from "components/Icon";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, url } from "utils";

const { upsertQueryParam, removeQueryParam } = url;
const { parseQueryString } = queryString;

enum TestStatus {
  Failed = "failed",
  Passed = "passed",
  All = "all",
}

export const HistoryTableTestSearch = () => {
  const [input, setInput] = useState<string>("");
  const [radioSelection, setRadioSelection] = useState<string>("failed");

  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const updateAndRemoveQueryParams = (selectedParams, removeKey: string) => {
    const updatedParams = upsertQueryParam(selectedParams, input);
    const removedParams = removeQueryParam(queryParams[removeKey], input);
    updateQueryParams({ [removeKey]: removedParams, all: updatedParams });
    setInput("");
  };

  const onClick = () => {
    const allParams = convertToArray((queryParams.all as string[]) || []);
    const failedParams = convertToArray((queryParams.failed as string[]) || []);
    const passedParams = convertToArray((queryParams.passed as string[]) || []);

    if (allParams.includes(input)) {
      setInput("");
      return;
    }
    if (radioSelection !== TestStatus.Failed && failedParams.includes(input)) {
      updateAndRemoveQueryParams(allParams, TestStatus.Failed);
      return;
    }
    if (radioSelection !== TestStatus.Passed && passedParams.includes(input)) {
      updateAndRemoveQueryParams(allParams, TestStatus.Passed);
      return;
    }

    const selectedParams = queryParams[radioSelection] as string[];
    const updatedParams = upsertQueryParam(selectedParams, input);
    updateQueryParams({ [radioSelection]: updatedParams });
    setInput("");
  };

  return (
    <ContentWrapper>
      <RadioBoxWrapper>
        <RadioBoxGroup
          value={radioSelection}
          onChange={(e) => setRadioSelection(e.target.value)}
        >
          <StyledRadioBox
            data-cy="test-search-failed"
            value={TestStatus.Failed}
          >
            Failed test
          </StyledRadioBox>
          <StyledRadioBox
            data-cy="test-search-passed"
            value={TestStatus.Passed}
          >
            Passed test
          </StyledRadioBox>
          <StyledRadioBox data-cy="test-search-all" value={TestStatus.All}>
            All test
          </StyledRadioBox>
        </RadioBoxGroup>
      </RadioBoxWrapper>

      <Input
        id="history-table-test-search-input"
        aria-label="Select Test Name Input"
        data-cy="history-table-test-search-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search Test Name"
        suffix={
          <Icon
            glyph="Plus"
            onClick={onClick}
            aria-label="Select plus button"
            data-cy="history-table-test-search-button"
          />
        }
        onPressEnter={onClick}
      />
    </ContentWrapper>
  );
};

const convertToArray = (params: string[] | string) =>
  Array.isArray(params) ? [...params] : [params];

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 600px; // only imposed because leafygreen RadioBoxGroup don't seem to be responsive
  padding-right: 30px;
`;

const RadioBoxWrapper = styled.div`
  margin-bottom: 14px;
`;

const StyledRadioBox = styled(RadioBox)`
  height: 32px;
`;
