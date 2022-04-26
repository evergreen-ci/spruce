import React, { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Select, Option } from "@leafygreen-ui/select";
import { Label } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";
import TextInput from "components/TextInputWithGlyph";
import { size } from "constants/tokens";

const { yellow } = uiColors;
type option = {
  value: string;
  displayName: string;
  placeHolderText: string;
};

interface TupleSelectProps {
  options: option[];
  onSubmit?: ({ category, value }: { category: string; value: string }) => void;
  validator?: (value: string) => boolean;
  validatorErrorMessage?: string;
}
const TupleSelect: React.VFC<TupleSelectProps> = ({
  options,
  onSubmit = () => {},
  validator = () => true,
  validatorErrorMessage = "Invalid Input",
}) => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(options[0].value);
  const [isValid, setIsValid] = useState(validator(input));

  const handleOnSubmit = () => {
    if (isValid) {
      onSubmit({ category: selected, value: input });
      setInput("");
    }
  };

  const handleOnChange = (value: string) => {
    setInput(value);
    setIsValid(validator(value));
  };
  const selectedOption = options.find((o) => o.value === selected);

  return (
    <Container>
      <StyledLabel htmlFor="filter-input">
        Add New {selectedOption.displayName} Filter
      </StyledLabel>
      <InputGroup>
        <GroupedSelect
          value={selected}
          onChange={(v) => setSelected(v)}
          aria-label="Select Drop Down"
          data-cy="tuple-select-dropdown"
          aria-labelledby="filter-input"
        >
          {options.map((o) => (
            <Option
              key={o.value}
              value={o.value}
              data-cy={`tuple-select-option-${o.value}`}
            >
              {o.displayName}
            </Option>
          ))}
        </GroupedSelect>
        <GroupedTextInput
          aria-labelledby="filter-input"
          id="filter-input"
          data-cy="tuple-select-input"
          value={input}
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder={selectedOption.placeHolderText}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && handleOnSubmit()
          }
          icon={
            <div>
              {isValid ? (
                <IconButton
                  onClick={handleOnSubmit}
                  aria-label="Select plus button"
                >
                  <Icon glyph="Plus" data-cy="tuple-select-button" />
                </IconButton>
              ) : (
                <InactiveIconWrapper>
                  <IconTooltip
                    glyph="Warning"
                    data-cy="tuple-select-warning"
                    fill={yellow.base}
                  >
                    {validatorErrorMessage}
                  </IconTooltip>
                </InactiveIconWrapper>
              )}
            </div>
          }
        />
      </InputGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const InputGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const InactiveIconWrapper = styled.div`
  margin: 6px;
`;

// @ts-expect-error
const GroupedSelect = styled(Select)`
  width: 30%;
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  button {
    margin-top: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const GroupedTextInput = styled(TextInput)`
  /* LG box-shadow property */
  box-shadow: 0px 1px 2px rgba(6, 22, 33, 0.3);
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

const StyledLabel = styled(Label)`
  margin-bottom: ${size.xxs};
`;

export default TupleSelect;
