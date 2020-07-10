import React from "react";
import { Disclaimer } from "@leafygreen-ui/typography";
import { InputLabel } from "components/styles";
import { RegexSelector } from "hooks/useNotificationModal";
import { Select, Input } from "antd";
import { v4 as uuid } from "uuid";
import Icon from "@leafygreen-ui/icon";
import styled from "@emotion/styled";

const { Option } = Select;

export interface RegexSelectorProps {
  disabledDropdownOptions: string[];
  dropdownOptions: RegexSelector[];
  key?: string;
  onChangeRegexValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSelectedOption: (optionValue: string) => void;
  onDelete: () => void;
  regexInputValue: string;
  selectedOption: string;
}

export const RegexSelectorInput = ({
  disabledDropdownOptions,
  dropdownOptions,
  onChangeRegexValue,
  onChangeSelectedOption,
  onDelete,
  regexInputValue,
  selectedOption,
}: RegexSelectorProps) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <Container>
      <FlexRow>
        <div>
          <div>
            <InputLabel htmlFor={dropdownId}>Field name</InputLabel>
          </div>
          <StyledSelect
            id={dropdownId}
            data-test-id="notify-by-select"
            value={selectedOption}
            onChange={onChangeSelectedOption}
          >
            {dropdownOptions.map((s) => (
              <Option
                key={s.type}
                disabled={disabledDropdownOptions.includes(s.type)}
                value={s.type}
                data-test-id={`${s.type}-option`}
              >
                {s.typeLabel}
              </Option>
            ))}
          </StyledSelect>
        </div>
        <MatchesRegexLabel>matches regex</MatchesRegexLabel>
      </FlexRow>
      <RegexContainer>
        <div>
          <InputLabel htmlFor={inputId}>Regex</InputLabel>
        </div>
        <FlexRow>
          <StyledInput
            data-cy={`${selectedOption}-input`}
            id={inputId}
            onChange={onChangeRegexValue}
            value={regexInputValue}
            disabled={!selectedOption}
          />
          <TrashContainer>
            <StyledIcon onClick={onDelete} glyph="Trash" />
          </TrashContainer>
        </FlexRow>
      </RegexContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  padding-bottom: 16px;
`;
const StyledIcon = styled(Icon)`
  cursor: pointer;
`;
const StyledSelect = styled(Select)`
  min-width: 160px;
`;
const FlexRow = styled.div`
  display: flex;
`;
const TrashContainer = styled.div`
  padding-left: 32px;
  margin-top: 6px;
`;
const RegexContainer = styled.div`
  width: 100%;
`;
const MatchesRegexLabel = styled(Disclaimer)`
  position: relative;
  top: 25px;
  padding-left: 8px;
  padding-right: 8px;
  white-space: nowrap;
`;
const StyledInput = styled(Input)`
  width: 100%;
`;
