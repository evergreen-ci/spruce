import { useState } from "react";
import styled from "@emotion/styled";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Input } from "antd";
import { useLocation } from "react-router-dom";
import { FilterBadges } from "components/FilterBadges";
import Icon from "components/Icon";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, url } from "utils";

const { upsertQueryParam } = url;
const { parseQueryString } = queryString;

export const TestSearch = () => {
  const [input, setInput] = useState<string>("");
  const [radioSelection, setRadioSelection] = useState<string>("failed");

  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const onClick = () => {
    const selectedParams = queryParams.tests as string[];
    const updatedParams = upsertQueryParam(selectedParams, input);
    updateQueryParams({ tests: updatedParams });
    setInput("");
  };

  return (
    <HeaderWrapper>
      <RadioBoxWrapper>
        <RadioBoxGroup
          value={radioSelection}
          onChange={(e) => setRadioSelection(e.target.value)}
        >
          <StyledRadioBox value="failed">Failed test</StyledRadioBox>
          <StyledRadioBox value="passed">Passed test</StyledRadioBox>
          <StyledRadioBox value="all">All test</StyledRadioBox>
        </RadioBoxGroup>
      </RadioBoxWrapper>

      <Input
        id="history-table-search-input"
        aria-label="Select Test Name Input"
        data-cy="history-table-search-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "60%" }}
        placeholder="Search Test Name"
        suffix={
          <Icon
            glyph="Plus"
            onClick={onClick}
            aria-label="Select plus button"
            data-cy="tuple-select-button"
          />
        }
        onPressEnter={onClick}
      />
      <BadgeWrapper>
        <FilterBadges />
      </BadgeWrapper>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioBoxWrapper = styled.div`
  width: 70%;
  margin-bottom: 14px;
`;

const StyledRadioBox = styled(RadioBox)`
  height: 32px;
  &div {
    min-width: 100px;
  }
`;

const BadgeWrapper = styled.div`
  padding-top: 16px;
  padding-bottom: 32px;
  height: 32px;
  margin-bottom: 60px; //remove
`;
