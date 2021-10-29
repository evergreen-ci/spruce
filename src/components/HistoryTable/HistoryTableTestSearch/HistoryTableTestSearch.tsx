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
  const [radioSelection, setRadioSelection] = useState<string>(
    TestStatus.Failed
  );

  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const updateAndRemoveQueryParams = (
    selectedParams: string[],
    removeKey: string
  ) => {
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
        <StyledRadioBoxGroup
          value={radioSelection}
          size="full"
          onChange={(e) => setRadioSelection(e.target.value)}
        >
          <RadioBox value={TestStatus.Failed}>Failed test</RadioBox>
          <RadioBox value={TestStatus.Passed}>Passed test</RadioBox>
          <RadioBox value={TestStatus.All}>All test</RadioBox>
        </StyledRadioBoxGroup>
      </RadioBoxWrapper>

      <TextInputWrapper>
        <TextInput
          type="search"
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

const convertToArray = (params: string[] | string) =>
  Array.isArray(params) ? [...params] : [params];

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 500px; // to prevent radio buttons from becoming visually squished if Content div becomes too small
  padding-right: 30px;
`;

const RadioBoxWrapper = styled.div`
  margin-bottom: 14px;
  width: 85%;
`;

// @ts-expect-error
const StyledRadioBoxGroup = styled(RadioBoxGroup)`
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
