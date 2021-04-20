import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Option, Select } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput from "@leafygreen-ui/text-input";
import { WidgetProps } from "@rjsf/core";

export const LeafyGreenTextInput: React.FC<WidgetProps> = ({
  value,
  title,
  placeholder,
  onChange,
  options: { "data-cy": dataCy },
}) => (
  <ElementWrapper>
    <TextInput
      data-cy={dataCy}
      value={value}
      label={title}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-label={title}
    />
  </ElementWrapper>
);

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
  title,
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
        name={title}
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

const ElementWrapper = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
`;
