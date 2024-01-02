import { useState } from "react";
import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { Label } from "@leafygreen-ui/typography";
import TextInput from "components/TextInputWithValidation";
import { size } from "constants/tokens";

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
  label?: React.ReactNode;
}
const TupleSelect: React.FC<TupleSelectProps> = ({
  label,
  onSubmit = () => {},
  options,
  validator = () => true,
  validatorErrorMessage = "Invalid Input",
}) => {
  const [selected, setSelected] = useState(options[0].value);

  const handleOnSubmit = (input: string) => {
    onSubmit({ category: selected, value: input });
  };

  const selectedOption = options.find((o) => o.value === selected);

  return (
    <Container>
      <Label htmlFor="filter-input">
        <LabelContainer>{label}</LabelContainer>
      </Label>
      <InputGroup>
        <GroupedSelect
          value={selected}
          onChange={(v) => setSelected(v)}
          data-cy="tuple-select-dropdown"
          aria-labelledby="Tuple Select"
          allowDeselect={false}
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
          id="filter-input"
          aria-label={selectedOption.displayName}
          data-cy="tuple-select-input"
          type="search"
          placeholder={selectedOption.placeHolderText}
          validator={validator}
          validatorErrorMessage={validatorErrorMessage}
          onSubmit={handleOnSubmit}
          clearOnSubmit
        />
      </InputGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-top: ${size.xxs};
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GroupedSelect = styled(Select)`
  width: 30%;
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  button {
    margin-top: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
`;

const GroupedTextInput = styled(TextInput)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

export default TupleSelect;
