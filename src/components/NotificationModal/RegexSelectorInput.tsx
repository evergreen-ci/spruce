import React from "react";
import { v4 as uuid } from "uuid";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Select, Input } from "antd";
import { RegexSelector } from "hooks/useNotificationModal";
import Icon from "@leafygreen-ui/icon";
import { InputLabel } from "components/styles";
import styled from "@emotion/styled";

const { Option } = Select;

export interface RegexSelectorProps {
  dropdownOptions: RegexSelector[];
  disabledDropdownOptions: string[];
  selectedOption: string;
  onChangeSelectedOption: (optionValue: string) => void;
  onChangeRegexValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  regexInputValue: string;
  onDelete: () => void;
}

export const RegexSelectorInput = ({
  dropdownOptions,
  disabledDropdownOptions,
  selectedOption,
  onChangeSelectedOption,
  onChangeRegexValue,
  onDelete,
  regexInputValue,
}: RegexSelectorProps) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <Container>
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
        <Disclaimer>matches regex</Disclaimer>
      </div>
      <MatchesRegexLabel>matches regex</MatchesRegexLabel>
      <div>
        <div>
          <InputLabel htmlFor={inputId}>Regex</InputLabel>
        </div>
        <StyledInput
          data-cy={`${selectedOption}-input`}
          id={inputId}
          onChange={onChangeRegexValue}
          value={regexInputValue}
          disabled={!selectedOption}
        />
      </div>
      {/* <TrashContainer>
        <Icon onClick={onDelete} glyph="Trash" />
      </TrashContainer> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 452px;
  padding-bottom: 16px;
  justify-content: space-between;
`;

const StyledSelect = styled(Select)`
  min-width: 160px;
`;

const TrashContainer = styled.div`
  position: relative;
  top: 29px;
  left: 8px;
`;

const MatchesRegexLabel = styled(Disclaimer)`
  position: relative;
  top: 25px;
  padding-left: 8px;
  padding-right: 8px;
`;

const StyledInput = styled(Input)`
  width: 100%;
`;
