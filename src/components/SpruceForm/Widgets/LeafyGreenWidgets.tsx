import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import Checkbox from "@leafygreen-ui/checkbox";
import { palette } from "@leafygreen-ui/palette";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import {
  SegmentedControl,
  SegmentedControlOption,
  SegmentedControlProps,
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
import { isNullish, processErrors } from "./utils";

const { yellow } = palette;

export const LeafyGreenTextInput: React.FC<
  { options: { optional?: boolean } } & SpruceWidgetProps
> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  schema,
  value,
}) => {
  const {
    ariaLabelledBy,
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    inputType,
    optional,
    warnings,
  } = options;

  const { errors, hasError } = processErrors(rawErrors);
  const emptyValue = options.emptyValue ?? "";

  const inputProps = {
    ...(!isNullish(schema.maximum) && { max: schema.maximum }),
    ...(!isNullish(schema.minimum) && { min: schema.minimum }),
    errorMessage: hasError ? errors.join(", ") : null,
    state: hasError ? TextInputState.Error : TextInputState.None,
  };

  return (
    <ElementWrapper limitMaxWidth css={elementWrapperCSS}>
      <StyledTextInput
        type={inputType}
        data-cy={dataCy}
        value={value === null || value === undefined ? "" : `${value}`}
        aria-labelledby={ariaLabelledBy}
        label={ariaLabelledBy ? undefined : label}
        placeholder={placeholder || undefined}
        description={description}
        optional={optional}
        disabled={disabled || readonly}
        onChange={({ target }) =>
          target.value === "" ? onChange(emptyValue) : onChange(target.value)
        }
        aria-label={label}
        {...inputProps}
      />
      {!!warnings?.length && (
        <WarningText data-cy="input-warning">{warnings.join(", ")}</WarningText>
      )}
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
  margin-top: ${size.xs};
`;

export const LeafyGreenCheckBox: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const {
    bold,
    customLabel,
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    tooltipDescription,
  } = options;
  return (
    <ElementWrapper css={elementWrapperCSS}>
      <Checkbox
        bold={bold || false}
        checked={value}
        data-cy={dataCy}
        description={description}
        disabled={disabled || readonly}
        label={
          <>
            {customLabel || label}
            {tooltipDescription && (
              <Tooltip
                popoverZIndex={zIndex.tooltip}
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
      />
    </ElementWrapper>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  top: 1px;
  vertical-align: text-top;
`;

export const LeafyGreenSelect: React.FC<
  { options: { allowDeselect?: boolean } } & EnumSpruceWidgetProps
> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    allowDeselect,
    ariaLabelledBy,
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
  } = options;
  const { hasError } = processErrors(rawErrors);

  const isDisabled = disabled || readonly;
  const labelProps: OneOf<{ label: string }, { "aria-labelledby": string }> =
    ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper limitMaxWidth css={elementWrapperCSS}>
      <Select
        allowDeselect={allowDeselect !== false}
        description={description}
        disabled={isDisabled}
        value={value}
        {...labelProps}
        onChange={onChange}
        placeholder={placeholder}
        id={dataCy}
        name={dataCy}
        data-cy={dataCy}
        state={hasError && !disabled ? "error" : "none"}
        errorMessage={hasError ? rawErrors?.join(", ") : ""}
        popoverZIndex={zIndex.dropdown}
      >
        {enumOptions.map((o) => {
          // LG Select doesn't handle disabled options well. So we need to ensure the selected option is not disabled
          const optionDisabled =
            (value !== o.value && enumDisabled?.includes(o.value)) ?? false;
          return (
            <Option key={o.value} value={o.value} disabled={optionDisabled}>
              {o.label}
            </Option>
          );
        })}
      </Select>
    </ElementWrapper>
  );
};

export const LeafyGreenRadio: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  id,
  label,
  onChange,
  options,
  value,
}) => {
  const {
    "data-cy": dataCy,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
  } = options;
  return (
    <ElementWrapper css={elementWrapperCSS}>
      <LabelContainer>
        <Label htmlFor={id}>{label}</Label>
      </LabelContainer>
      <RadioGroup
        data-cy={dataCy}
        id={id}
        name={label}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          const { description } = o.schema ?? {};
          return (
            <Radio
              key={o.value}
              value={o.value}
              disabled={disabled || optionDisabled}
              description={description}
            >
              {o.label}
            </Radio>
          );
        })}
      </RadioGroup>
    </ElementWrapper>
  );
};

export const LeafyGreenRadioBox: React.FC<
  { options: { description: string | JSX.Element } } & EnumSpruceWidgetProps
> = ({ disabled, id, label, onChange, options, uiSchema, value }) => {
  const {
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    errors,
    showLabel,
    warnings,
  } = options;

  // Workaround because {ui:widget: hidden} does not play nicely with this widget
  const hide = uiSchema["ui:hide"] ?? false;
  if (hide) {
    return null;
  }

  // RadioBox components do not accept boolean props for value, so use the indices instead.
  const valueMap = enumOptions.map(({ value: val }) => val);

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {showLabel !== false && (
        <LabelContainer>
          <Label htmlFor={id} disabled={disabled}>
            {label}
          </Label>
          {description && <Description>{description}</Description>}
        </LabelContainer>
      )}
      {!!errors && (
        <StyledBanner variant="danger" data-cy="error-banner">
          {errors.join(", ")}
        </StyledBanner>
      )}
      {!!warnings && (
        <StyledBanner variant="warning" data-cy="warning-banner">
          {warnings.join(", ")}
        </StyledBanner>
      )}
      <RadioBoxGroup
        id={id}
        name={label}
        value={valueMap.indexOf(value)}
        onChange={(e) => onChange(valueMap[e.target.value])}
        data-cy={dataCy}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          return (
            <StyledRadioBox
              key={valueMap.indexOf(o.value)}
              value={valueMap.indexOf(o.value)}
              disabled={disabled || optionDisabled}
            >
              {o.label}
            </StyledRadioBox>
          );
        })}
      </RadioBoxGroup>
    </ElementWrapper>
  );
};

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

const LabelContainer = styled.div`
  margin-bottom: ${size.xs};
`;

const StyledRadioBox = styled(RadioBox)`
  line-height: 1.25;
`;

export const LeafyGreenTextArea: React.FC<SpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    "data-cy": dataCy,
    description,
    elementWrapperCSS,
    emptyValue = "",
    focusOnMount,
    rows,
  } = options;

  const { errors, hasError } = processErrors(rawErrors);
  const el = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    if (focusOnMount) {
      const textarea = el.current;
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;
      }
    }
  }, [focusOnMount]);

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <TextArea
        ref={el}
        placeholder={placeholder || undefined}
        data-cy={dataCy}
        label={label}
        description={description}
        disabled={disabled || readonly}
        value={value}
        onChange={({ target }) =>
          target.value === "" ? onChange(emptyValue) : onChange(target.value)
        }
        errorMessage={hasError ? errors.join(", ") : null}
        rows={rows}
        state={hasError ? "error" : "none"}
      />
    </ElementWrapper>
  );
};

export const LeafyGreenSegmentedControl: React.FC<EnumSpruceWidgetProps> = ({
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
    elementWrapperCSS,
    enumDisabled,
    enumOptions,
    sizeVariant,
  } = options;

  const isDisabled = disabled || readonly;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <StyledSegmentedControl
        data-cy={dataCy}
        label={label}
        value={value}
        onChange={onChange}
        aria-controls={ariaControls?.join(" ")}
        size={sizeVariant as SegmentedControlProps["size"]}
      >
        {enumOptions.map((o) => {
          const optionDisabled = enumDisabled?.includes(o.value) ?? false;
          return (
            <SegmentedControlOption
              key={o.value}
              value={o.value}
              disabled={isDisabled || optionDisabled}
            >
              {o.label}
            </SegmentedControlOption>
          );
        })}
      </StyledSegmentedControl>
    </ElementWrapper>
  );
};

const StyledSegmentedControl = styled(SegmentedControl)`
  box-sizing: border-box;
  margin-bottom: ${size.s};
`;
