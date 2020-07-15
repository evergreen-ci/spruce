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
  dataCyPrefix?: number;
  disabledDropdownOptions: string[];
  dropdownOptions: RegexSelector[];
  isVisibleDelete?: boolean;
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
  dataCyPrefix,
  isVisibleDelete,
}: RegexSelectorProps) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <Container
      isVisibleDelete={isVisibleDelete}
      data-cy={`${dataCyPrefix}-regex-selector-container`}
    >
      <FlexRow>
        <div>
          <div>
            <InputLabel htmlFor={dropdownId}>Field name</InputLabel>
          </div>
          <StyledSelect
            id={dropdownId}
            data-test-id={`${dataCyPrefix}-regex-selector-dropdown`}
            value={selectedOption}
            onChange={onChangeSelectedOption}
          >
            {(dropdownOptions ?? []).map((s) => (
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
            data-cy={`${dataCyPrefix}-regex-selector-input`}
            id={inputId}
            onChange={onChangeRegexValue}
            value={regexInputValue}
            disabled={!selectedOption}
          />
          <TrashContainer isVisibleDelete={isVisibleDelete}>
            <StyledIcon
              data-cy={`${dataCyPrefix}-regex-selector-trash`}
              onClick={onDelete}
              glyph="Trash"
            />
          </TrashContainer>
        </FlexRow>
      </RegexContainer>
    </Container>
  );
};
interface DeleteProps {
  isVisibleDelete: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: ${(props: DeleteProps): string =>
    props.isVisibleDelete ? "80%" : "calc(80% - 50px)"};
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
  display: ${(props: DeleteProps): string =>
    props.isVisibleDelete ? "block" : "none"};
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
