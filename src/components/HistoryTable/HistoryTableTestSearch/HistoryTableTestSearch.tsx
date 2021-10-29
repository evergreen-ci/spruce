import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import TextInput from "@leafygreen-ui/text-input";
import { useLocation } from "react-router-dom";
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
  const [input, setInput] = useState("");
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
          size="full"
          onChange={(e) => setRadioSelection(e.target.value)}
        >
          <StyledRadioBox value={TestStatus.Failed}>Failed test</StyledRadioBox>
          <StyledRadioBox value={TestStatus.Passed}>Passed test</StyledRadioBox>
          <StyledRadioBox value={TestStatus.All}>All test</StyledRadioBox>
        </RadioBoxGroup>
      </RadioBoxWrapper>

      <TextInputWrapper>
        <TextInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search Test Name"
          onKeyPress={(e) => e.key === "Enter" && onClick()}
          type="search"
          aria-label="history-table-test-search-input"
        />
        <StyledIcon glyph="Plus" onClick={() => onClick()} />
      </TextInputWrapper>
    </ContentWrapper>
  );
};

const convertToArray = (params: string[] | string) =>
  Array.isArray(params) ? [...params] : [params];

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 400px; // to prevent radio buttons from becoming visually squished if Content div becomes too small
  padding-right: 30px;
`;

const RadioBoxWrapper = styled.div`
  margin-bottom: 14px;
`;

const StyledRadioBox = styled(RadioBox)`
  height: 32px;
`;

const TextInputWrapper = styled.div`
  position: relative;
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  &:hover {
    cursor: pointer;
  }
`;
