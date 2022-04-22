import { useState } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Label } from "@leafygreen-ui/typography";
import { Input, Select } from "antd";
import Icon from "components/Icon";
import { IconTooltip } from "components/IconTooltip";
import useTupleSelectQueryParams from "./useTupleSelectQueryParams";

const { yellow } = uiColors;
const { Option } = Select;
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
      <Label htmlFor="filter-input">
        Add New {selectedOption.displayName} Filter
      </Label>
      <Input.Group compact>
        <Select
          style={{ width: "30%" }}
          value={selected}
          onChange={(v) => setSelected(v)}
          aria-label="Select Drop Down"
          data-cy="tuple-select-dropdown"
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
        </Select>
        <Input
          id="filter-input"
          aria-label="Select Text Input"
          data-cy="tuple-select-input"
          value={input}
          onChange={(e) => handleOnChange(e.target.value)}
          style={{ width: "70%" }}
          placeholder={selectedOption.placeHolderText}
          suffix={
            isValid ? (
              <Icon
                glyph="Plus"
                onClick={handleOnSubmit}
                aria-label="Select plus button"
                data-cy="tuple-select-button"
              />
            ) : (
              <IconTooltip
                glyph="Warning"
                tooltipText={validatorErrorMessage}
                data-cy="tuple-select-warning"
                fill={yellow.base}
              />
            )
          }
          onPressEnter={handleOnSubmit}
        />
      </Input.Group>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default TupleSelect;
export { useTupleSelectQueryParams };
