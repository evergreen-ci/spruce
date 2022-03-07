import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Option, Select } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput from "@leafygreen-ui/text-input";
import Tooltip from "@leafygreen-ui/tooltip";
import { Description, Label } from "@leafygreen-ui/typography";
import { WidgetProps } from "@rjsf/core";
import Icon from "components/Icon";
import { size } from "constants/tokens";

import ElementWrapper from "./ElementWrapper";

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
    showErrors = true,
  } = options;
  const errors = getInputErrors(rawErrors);
  const hasError = !!errors?.length;
  const errorProps = showErrors
    ? {
        errorMessage: hasError ? errors.join(", ") : null,
        state: hasError ? "error" : "none",
      }
    : {};
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
              target.value === "" && emptyValue !== undefined
                ? emptyValue
                : target.value
            )
          }
          aria-label={label}
          {...errorProps}
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
  margin-left: ${size.xxs};
  top: 1px;
  vertical-align: text-top;
`;

export const LeafyGreenSelect: React.FC<WidgetProps> = ({
  disabled,
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

  const hasError = !!rawErrors?.length && !disabled;

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
          disabled={disabled}
          label={ariaLabelledBy ? undefined : label}
          value={value}
          onChange={(v) => onChange(v === "" ? null : v)}
          placeholder={placeholder}
          id={dataCy as string}
          name={dataCy as string}
          data-cy={dataCy}
          state={hasError ? "error" : "none"}
          errorMessage="Selection is required."
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
      </MaxWidthContainer>
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
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  uiSchema,
}) => {
  const { description, enumOptions, "data-cy": dataCy, showLabel } = options;
  if (!Array.isArray(enumOptions)) {
    console.error(
      "enumOptions must be an array passed into LeafyGreen Radio Box"
    );
    return null;
  }

  // Workaround because {ui:widget: hidden} does not play nicely with this widget
  const hide = uiSchema["ui:hide"] ?? false;
  if (hide) {
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
  margin-bottom: ${size.xs};
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

export const LeafyGreenSegmentedControl: React.FC<WidgetProps> = ({
  id,
  label,
  onChange,
  options,
  value,
}) => {
  const { "aria-controls": ariaControls, enumOptions } = options;

  if (!Array.isArray(enumOptions)) {
    console.error("Non-Array passed into Segmented Control");
    return null;
  }

  const idPrefix = id.substring(0, id.lastIndexOf("_"));

  return (
    <ElementWrapper>
      <StyledSegmentedControl
        label={label}
        value={value}
        onChange={onChange}
        aria-controls={(ariaControls as string[])
          ?.map((childId) => `${idPrefix}_${childId}`)
          ?.join(" ")}
      >
        {enumOptions.map((o) => (
          <SegmentedControlOption key={o.value} value={o.value}>
            {o.label}
          </SegmentedControlOption>
        ))}
      </StyledSegmentedControl>
    </ElementWrapper>
  );
};

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-bottom: ${size.s};
`;

const MaxWidthContainer = styled.div`
  max-width: 400px;
`;
