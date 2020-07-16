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
  canDelete?: boolean;
  key?: string;
  onChangeRegexValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSelectedOption: (optionValue: string) => void;
  onDelete: () => void;
  regexInputValue: string;
  selectedOption: string;
}

export const RegexSelectorInput: React.FC<RegexSelectorProps> = ({
  disabledDropdownOptions,
  dropdownOptions,
  onChangeRegexValue,
  onChangeSelectedOption,
  onDelete,
  regexInputValue,
  selectedOption,
  dataCyPrefix,
  canDelete,
}) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <Container
      canDelete={canDelete}
      data-cy={`${dataCyPrefix}-regex-selector-container`}
    >
      <FlexRow>
        <div>
          <InputLabel htmlFor={dropdownId}>Field name</InputLabel>
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
                data-test-id={`${dataCyPrefix}-${s.type}-option`}
              >
                {s.typeLabel}
              </Option>
            ))}
          </StyledSelect>
        </div>
        <MatchesRegexLabel>matches regex</MatchesRegexLabel>
      </FlexRow>
      <RegexContainer>
        <InputLabel htmlFor={inputId}>Regex</InputLabel>
        <FlexRow>
          <StyledInput
            data-cy={`${dataCyPrefix}-regex-selector-input`}
            id={inputId}
            onChange={onChangeRegexValue}
            value={regexInputValue}
            disabled={!selectedOption}
          />
          <TrashContainer
            data-cy={`${dataCyPrefix}-regex-selector-trash-container`}
            canDelete={canDelete}
          >
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
  canDelete: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: ${(props: DeleteProps): string =>
    props.canDelete ? "80%" : "calc(80% - 50px)"};
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
    props.canDelete ? "block" : "none"};
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
