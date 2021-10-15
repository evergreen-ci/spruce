import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Option, Select } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput, { TextInputType } from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";
import ElementWrapper from "./ElementWrapper";

const getInputType = (
  schemaType: WidgetProps["schema"]["type"]
): TextInputType => {
  if (schemaType === "number") {
    return TextInputType.Number;
  }
  return TextInputType.Text;
};

export const LeafyGreenTextInput: React.FC<WidgetProps> = ({
  value,
  label,
  placeholder,
  onChange,
  disabled,
  options,
  schema: { type },
  rawErrors,
}) => {
  const { description, "data-cy": dataCy } = options;
  const hasError = !!rawErrors?.length;
  return (
    <ElementWrapper>
      <TextInputContainer>
        <TextInput
          data-cy={dataCy}
          value={`${value !== undefined ? value : ""}`}
          label={label}
          placeholder={placeholder}
          description={description as string}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          errorMessage={hasError ? rawErrors.join(", ") : null}
          state={hasError ? "error" : "none"}
          type={getInputType(type)}
        />
      </TextInputContainer>
    </ElementWrapper>
  );
};

const TextInputContainer = styled.div`
  max-width: 400px;
`;

export const LeafyGreenCheckBox: React.FC<WidgetProps> = ({
  value,
  label,
  onChange,
  disabled,
  options: { "data-cy": dataCy },
}) => (
  <ElementWrapper>
    <Checkbox
      data-cy={dataCy}
      checked={value}
      label={label}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
  </ElementWrapper>
);

export const LeafyGreenSelect: React.FC<WidgetProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const { enumOptions, "data-cy": dataCy } = options;
  if (!Array.isArray(enumOptions)) {
    console.error("Non Array passed into leafygreen select");
    return null;
  }
  return (
    <ElementWrapper>
      <Select
        label={label}
        value={value}
        onChange={(v) => onChange(v)}
        data-cy={dataCy}
      >
        {enumOptions.map((o) => (
          <Option key={o.value} value={o.value}>
            {o.label}
          </Option>
        ))}
      </Select>
    </ElementWrapper>
  );
};

export const LeafyGreenRadio: React.FC<WidgetProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const { enumOptions, "data-cy": dataCy } = options;
  if (!Array.isArray(enumOptions)) {
    console.error("Non Array passed into leafygreen radio");
    return null;
  }

  return (
    <ElementWrapper>
      <RadioGroup
        name={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-cy={dataCy}
      >
        {enumOptions.map((o) => (
          <Radio key={o.value} value={o.value} disabled={disabled}>
            {o.label}
          </Radio>
        ))}
      </RadioGroup>
    </ElementWrapper>
  );
};

export const LeafyGreenRadioBox: React.FC<WidgetProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const { enumOptions, "data-cy": dataCy } = options;
  if (!Array.isArray(enumOptions)) {
    console.error(
      "enumOptions must be an array passed into LeafyGreen Radio Box"
    );
    return null;
  }

  return (
    <ElementWrapper>
      <RadioBoxGroup
        name={label}
        value={value}
        onChange={(e) => onChange(e.target.value === "true")}
        data-cy={dataCy}
      >
        {enumOptions.map((o) => (
          <RadioBox key={o.value} value={o.value} disabled={disabled}>
            {o.label}
          </RadioBox>
        ))}
      </RadioBoxGroup>
    </ElementWrapper>
  );
};

export const LeafyGreenTextArea: React.FC<WidgetProps> = ({
  label,
  disabled,
  value,
  onChange,
  options: { "data-cy": dataCy },
}) => (
  <ElementWrapper>
    <TextArea
      data-cy={dataCy}
      label={label}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </ElementWrapper>
);
