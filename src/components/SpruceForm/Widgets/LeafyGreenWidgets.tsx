import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
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
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";
import { OneOf } from "types/utils";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps, SpruceWidgetProps } from "./types";

const { yellow } = uiColors;

export const LeafyGreenTextInput: React.VFC<
  { options: { optional?: boolean } } & SpruceWidgetProps
> = ({
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
    marginBottom,
    optional,
    warnings,
  } = options;
  const hasError = !!rawErrors?.length;
  const errorProps = {
    errorMessage: hasError ? rawErrors.join(", ") : null,
    state: hasError ? TextInputState.Error : TextInputState.None,
  };
  return (
    <ElementWrapper marginBottom={marginBottom}>
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
        {!!warnings?.length && (
          <WarningText data-cy="input-warning">
            {warnings.join(", ")}
          </WarningText>
        )}
      </MaxWidthContainer>
    </ElementWrapper>
  );
};

const StyledTextInput = styled(TextInput)`
  p {
    /* Fixes positioning of "Optional" label */
    margin: 0;
  }
`;

const WarningText = styled.p`
  color: ${yellow.dark2};
  line-height: 1.2;
`;

export const LeafyGreenCheckBox: React.VFC<SpruceWidgetProps> = ({
  value,
  label,
  onChange,
  disabled,
  options,
  readonly,
}) => {
  const { "data-cy": dataCy, marginBottom, tooltipDescription } = options;
  return (
    <ElementWrapper marginBottom={marginBottom}>
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

export const LeafyGreenSelect: React.VFC<
  { options: { allowDeselect?: boolean } } & EnumSpruceWidgetProps
> = ({
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
    description,
    enumOptions,
    "data-cy": dataCy,
    marginBottom,
  } = options;

  const hasError = !!rawErrors?.length && !disabled;
  const isDisabled = disabled || readonly;
  const labelProps: OneOf<
    { label: string },
    { "aria-labelledby": string }
  > = ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper marginBottom={marginBottom}>
      <MaxWidthContainer>
        <Select
          allowDeselect={allowDeselect !== false}
          description={description}
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

export const LeafyGreenRadio: React.VFC<EnumSpruceWidgetProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const { "data-cy": dataCy, enumOptions, marginBottom } = options;
  return (
    <ElementWrapper marginBottom={marginBottom}>
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

export const LeafyGreenRadioBox: React.VFC<EnumSpruceWidgetProps> = ({
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
    "data-cy": dataCy,
    enumOptions,
    errors,
    marginBottom,
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
    <ElementWrapper marginBottom={marginBottom}>
      {showLabel !== false && (
        <RadioBoxLabelContainer>
          <Label htmlFor={id} disabled={disabled}>
            {label}
          </Label>
          {description && <Description>{description}</Description>}
        </RadioBoxLabelContainer>
      )}
      {!!errors?.length && (
        <StyledBanner variant="danger">{errors?.join(", ")}</StyledBanner>
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

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

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

export const LeafyGreenSegmentedControl: React.VFC<EnumSpruceWidgetProps> = ({
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
    marginBottom,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper marginBottom={marginBottom}>
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

const MaxWidthContainer = styled.div`
  max-width: 400px;
`;
