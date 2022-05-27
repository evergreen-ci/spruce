import { useMemo } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import TextInput from "@leafygreen-ui/text-input";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { v4 as uuid } from "uuid";
import { InputLabel } from "components/styles";
import { size } from "constants/tokens";
import { RegexSelector } from "types/triggers";

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

export const RegexSelectorInput: React.VFC<RegexSelectorProps> = ({
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
  const dropdownId = useMemo(() => uuid(), []);
  const inputId = useMemo(() => uuid(), []);
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
            data-cy={`${dataCyPrefix}-regex-selector-dropdown`}
            value={selectedOption}
            onChange={onChangeSelectedOption}
          >
            {(dropdownOptions ?? []).map((s) => (
              <Option
                key={s.type}
                disabled={disabledDropdownOptions.includes(s.type)}
                value={s.type}
                data-cy={`${dataCyPrefix}-${s.type}-option`}
              >
                {s.typeLabel}
              </Option>
            ))}
          </StyledSelect>
        </div>
        <MatchesRegexLabel>matches regex</MatchesRegexLabel>
      </FlexRow>
      <RegexContainer>
        <FlexRowAlign>
          <StyledInput
            label="Regex"
            data-cy={`${dataCyPrefix}-regex-selector-input`}
            id={inputId}
            onChange={onChangeRegexValue}
            value={regexInputValue}
            disabled={!selectedOption}
          />
          {canDelete && (
            <TrashContainer
              data-cy={`${dataCyPrefix}-regex-selector-trash-container`}
            >
              <IconButton
                data-cy={`${dataCyPrefix}-regex-selector-trash`}
                onClick={onDelete}
                aria-label="Remove regex selector row"
              >
                <Icon glyph="Trash" />
              </IconButton>
            </TrashContainer>
          )}
        </FlexRowAlign>
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
    props.canDelete ? "80%" : "calc(80% - 55px)"};
  padding-bottom: ${size.s};
`;
const StyledSelect = styled(Select)`
  min-width: 160px;
`;
const FlexRow = styled.div`
  display: flex;
`;
const FlexRowAlign = styled(FlexRow)`
  align-items: flex-end;
`;
const TrashContainer = styled.div`
  padding-left: ${size.m};
  padding-bottom: ${size.xxs};
`;
const RegexContainer = styled.div`
  width: 100%;
`;
const MatchesRegexLabel = styled(Disclaimer)`
  position: relative;
  top: ${size.m};
  padding-left: ${size.xs};
  padding-right: ${size.xs};
  white-space: nowrap;
`;
const StyledInput = styled(TextInput)`
  width: 100%;
`;
