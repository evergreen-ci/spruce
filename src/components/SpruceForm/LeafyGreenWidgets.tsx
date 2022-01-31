import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Option, Select } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput from "@leafygreen-ui/text-input";
import Tooltip from "@leafygreen-ui/tooltip";
import { Description, Label } from "@leafygreen-ui/typography";
import { WidgetProps } from "@rjsf/core";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import ElementWrapper from "./ElementWrapper";

const { red } = uiColors;

const getInputErrors = (rawErrors: string[]): string[] =>
  // Don't display empty input errors as these are too visually noisy
  rawErrors?.filter((err) => !err.startsWith("should match format")) ?? [];
export const LeafyGreenTextInput: React.FC<WidgetProps> = ({
  value,
  label,
  placeholder,
  onChange,
  disabled,
  options,
  rawErrors,
  readonly,
  formContext,
}) => {
  const {
    ariaLabelledBy,
    description,
    "data-cy": dataCy,
    emptyValue,
  } = options;
  const errors = getInputErrors(rawErrors);
  const hasError = !!errors?.length;
  const { readonlyAsDisabled = true } = formContext;
  return (
    <ElementWrapper>
      <MaxWidthContainer>
        <TextInput
          data-cy={dataCy}
          value={value === null || value === undefined ? null : `${value}`}
          // @ts-expect-error
          aria-labelledby={ariaLabelledBy}
          label={ariaLabelledBy ? undefined : label}
          placeholder={placeholder || undefined}
          description={description as string}
          disabled={disabled || (readonlyAsDisabled && readonly)}
          onChange={({ target }) =>
            onChange(
              target.value === "" && emptyValue ? emptyValue : target.value
            )
          }
          aria-label={label}
          errorMessage={hasError ? errors.join(", ") : null}
          state={hasError ? "error" : "none"}
        />
      </MaxWidthContainer>
    </ElementWrapper>
  );
};

export const LeafyGreenCheckBox: React.FC<WidgetProps> = ({
  value,
  label,
  onChange,
  disabled,
  options: { "data-cy": dataCy, tooltipDescription },
  readonly,
  formContext,
}) => {
  const { readonlyAsDisabled = true } = formContext;
  return (
    <ElementWrapper>
      <Checkbox
        data-cy={dataCy}
        checked={value}
        label={
          <>
            {label}
            {tooltipDescription && (
              <Tooltip
                justify="middle"
                trigger={
                  <IconContainer>
                    <Icon glyph="InfoWithCircle" size="small" />
                  </IconContainer>
                }
                triggerEvent="hover"
              >
                {tooltipDescription}
              </Tooltip>
            )}
          </>
        }
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled || (readonlyAsDisabled && readonly)}
      />
    </ElementWrapper>
  );
};

const IconContainer = styled.span`
  margin-left: 4px;
  top: 1px;
  vertical-align: text-top;
`;

export const LeafyGreenSelect: React.FC<WidgetProps> = ({
  label,
  options,
  placeholder,
  value,
  onChange,
  rawErrors,
}) => {
  const {
    allowDeselect,
    ariaLabelledBy,
    enumOptions,
    "data-cy": dataCy,
  } = options;

  const hasError = !!rawErrors?.length;

  if (!Array.isArray(enumOptions)) {
    console.error("Non Array passed into leafygreen select");
    return null;
  }
  return (
    <ElementWrapper>
      <MaxWidthContainer>
        <Select
          allowDeselect={allowDeselect !== false}
          // @ts-expect-error
          aria-labelledby={ariaLabelledBy}
          label={ariaLabelledBy ? undefined : label}
          value={value}
          onChange={(v) => onChange(v === "" ? null : v)}
          placeholder={placeholder}
          data-cy={dataCy}
        >
          {enumOptions.map((o) => {
            // Handle deselect value without errors
            if (o.value === null) {
              return;
            }
            return (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            );
          })}
        </Select>
        {hasError && <Error>Selection is required.</Error>}
      </MaxWidthContainer>
    </ElementWrapper>
  );
};

const Error = styled(Description)`
  color: ${red.base};
`;

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
  id,
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const { description, enumOptions, "data-cy": dataCy, showLabel } = options;
  if (!Array.isArray(enumOptions)) {
    console.error(
      "enumOptions must be an array passed into LeafyGreen Radio Box"
    );
    return null;
  }

  // RadioBox components do not accept boolean props for value, so use the indices instead.
  const valueMap = enumOptions.map(({ value: val }) => val);

  return (
    <ElementWrapper>
      {showLabel !== false && (
        <RadioBoxLabelContainer>
          <Label htmlFor={id} disabled={disabled}>
            {label}
          </Label>
          {description && <Description>{description}</Description>}
        </RadioBoxLabelContainer>
      )}
      <RadioBoxGroup
        id={id}
        name={label}
        value={valueMap.indexOf(value)}
        onChange={(e) => onChange(valueMap[e.target.value])}
        data-cy={dataCy}
      >
        {enumOptions.map((o) => (
          <StyledRadioBox
            key={valueMap.indexOf(o.value)}
            value={valueMap.indexOf(o.value)}
            disabled={disabled}
          >
            {o.label}
          </StyledRadioBox>
        ))}
      </RadioBoxGroup>
    </ElementWrapper>
  );
};

const RadioBoxLabelContainer = styled.div`
  margin-bottom: ${size.xs}px;
`;

const StyledRadioBox = styled(RadioBox)`
  line-height: 1.25;
`;

export const LeafyGreenTextArea: React.FC<WidgetProps> = ({
  label,
  disabled,
  value,
  onChange,
  options: { "data-cy": dataCy, marginBottom },
  rawErrors,
  readonly,
  formContext,
}) => {
  const { readonlyAsDisabled = true } = formContext;
  const errors = getInputErrors(rawErrors);
  const hasError = !!errors?.length;
  return (
    <ElementWrapper marginBottom={marginBottom as number}>
      <TextArea
        data-cy={dataCy}
        label={label}
        disabled={disabled || (readonlyAsDisabled && readonly)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        errorMessage={hasError ? errors.join(", ") : null}
        state={hasError ? "error" : "none"}
      />
    </ElementWrapper>
  );
};

const MaxWidthContainer = styled.div`
  max-width: 400px;
`;
