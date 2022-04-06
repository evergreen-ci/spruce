import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Option, Select } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput, { State as TextInputState } from "@leafygreen-ui/text-input";
import Tooltip from "@leafygreen-ui/tooltip";
import { Description, Label } from "@leafygreen-ui/typography";
import { WidgetProps } from "@rjsf/core";
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";
import { OneOf } from "types/utils";
import ElementWrapper from "./ElementWrapper";

const { red, yellow } = uiColors;

interface SpruceWidgetProps extends WidgetProps {
  options: Partial<{
    allowDeselect: boolean;
    ariaLabelledBy: string;
    "aria-controls": string[];
    "data-cy": string;
    description: string;
    emptyValue: string | null;
    enumOptions: Array<{
      label: string;
      value: string;
    }>;
    marginBottom: number;
    optional: boolean;
    rawErrors: string[];
    showLabel: boolean;
    tooltipDescription: string;
    warnings: string[];
  }>;
}

export const LeafyGreenTextInput: React.VFC<SpruceWidgetProps> = ({
  value,
  label,
  placeholder,
  onChange,
  disabled,
  options,
  rawErrors,
  readonly,
}) => {
  const {
    ariaLabelledBy,
    description,
    "data-cy": dataCy,
    emptyValue,
    optional,
    warnings,
  } = options;
  const hasError = !!rawErrors?.length;
  const errorProps = {
    errorMessage: hasError ? rawErrors.join(", ") : null,
    state: hasError ? TextInputState.Error : TextInputState.None,
  };
  return (
    <ElementWrapper>
      <MaxWidthContainer>
        <StyledTextInput
          data-cy={dataCy}
          value={value === null || value === undefined ? null : `${value}`}
          aria-labelledby={ariaLabelledBy}
          label={ariaLabelledBy ? undefined : label}
          placeholder={placeholder || undefined}
          description={description}
          optional={optional}
          disabled={disabled || readonly}
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
        {!!warnings?.length && <WarningText>{warnings.join(", ")}</WarningText>}
      </MaxWidthContainer>
    </ElementWrapper>
  );
};

const StyledTextInput = styled(TextInput)`
  p {
    margin: 0;
  }
`;

export const LeafyGreenCheckBox: React.VFC<SpruceWidgetProps> = ({
  value,
  label,
  onChange,
  disabled,
  options,
  readonly,
}) => {
  const { "data-cy": dataCy, tooltipDescription } = options;
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
        disabled={disabled || readonly}
      />
    </ElementWrapper>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  top: 1px;
  vertical-align: text-top;
`;

export const LeafyGreenSelect: React.VFC<SpruceWidgetProps> = ({
  disabled,
  label,
  options,
  placeholder,
  readonly,
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
  const isDisabled = disabled || readonly;
  const labelProps: OneOf<
    { label: string },
    { "aria-labelledby": string }
  > = ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper>
      <MaxWidthContainer>
        <Select
          allowDeselect={allowDeselect !== false}
          disabled={isDisabled}
          value={value}
          {...labelProps}
          onChange={(v) => onChange(v === "" ? null : v)}
          placeholder={placeholder}
          id={dataCy}
          name={dataCy}
          data-cy={dataCy}
          state={hasError ? "error" : "none"}
          errorMessage="Selection is required."
          popoverZIndex={zIndex.dropdown}
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

export const LeafyGreenRadio: React.VFC<SpruceWidgetProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const { enumOptions, "data-cy": dataCy } = options;
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

export const LeafyGreenRadioBox: React.VFC<SpruceWidgetProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  uiSchema,
}) => {
  const {
    description,
    enumOptions,
    "data-cy": dataCy,
    rawErrors,
    showLabel,
  } = options;
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
      {!!rawErrors?.length && <ErrorText>{rawErrors?.join(", ")}</ErrorText>}
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

export const LeafyGreenTextArea: React.VFC<SpruceWidgetProps> = ({
  label,
  disabled,
  value,
  onChange,
  options,
  rawErrors,
  readonly,
}) => {
  const { "data-cy": dataCy, marginBottom } = options;
  const hasError = !!rawErrors?.length;
  return (
    <ElementWrapper marginBottom={marginBottom}>
      <TextArea
        data-cy={dataCy}
        label={label}
        disabled={disabled || readonly}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        errorMessage={hasError ? rawErrors.join(", ") : null}
        state={hasError ? "error" : "none"}
      />
    </ElementWrapper>
  );
};

export const LeafyGreenSegmentedControl: React.VFC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    "aria-controls": ariaControls,
    "data-cy": dataCy,
    enumOptions,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper>
      <StyledSegmentedControl
        data-cy={dataCy}
        label={label}
        value={value}
        onChange={onChange}
        aria-controls={ariaControls?.join(" ")}
      >
        {enumOptions.map((o) => (
          <SegmentedControlOption
            key={o.value}
            value={o.value}
            disabled={isDisabled}
          >
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

const ErrorText = styled.p`
  color: ${red.base};
`;

const WarningText = styled.p`
  color: ${yellow.dark2};
  line-height: 1.2;
`;

const MaxWidthContainer = styled.div`
  max-width: 400px;
`;
