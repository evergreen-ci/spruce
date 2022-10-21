import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Select } from "antd";
import { InputLabel } from "components/styles";
import { OneOf } from "types/utils";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps } from "./types";

const { Option } = Select;
const { red } = palette;

export const AntdSelect: React.VFC<
  {
    options: {
      disabledEnums?: string[];
      hideError?: boolean;
    };
  } & EnumSpruceWidgetProps
> = ({
  disabled,
  label,
  options,
  onChange,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    "data-cy": dataCy,
    ariaLabelledBy,
    disabledEnums,
    elementWrapperCSS,
    enumOptions,
    hideError,
  } = options;

  const hasError = !hideError && !!rawErrors?.length && !disabled;
  const isDisabled = disabled || readonly;
  const disabledOptions = disabledEnums ?? [];

  const labelProps: OneOf<{ label: string }, { "aria-labelledby": string }> =
    ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper css={elementWrapperCSS}>
      <MaxWidthContainer>
        <InputLabel htmlFor={dataCy}>{label}</InputLabel>
        <Select
          getPopupContainer={getPopupContainer}
          data-cy={dataCy}
          disabled={isDisabled}
          id={dataCy}
          onChange={(v) => onChange(v === "" ? null : v)}
          placeholder={placeholder}
          status={hasError ? "error" : ""}
          value={value}
          {...labelProps}
        >
          {enumOptions.map((o) => {
            // Handle deselect value without errors
            if (o.value === null) {
              return;
            }
            return (
              <Option
                disabled={
                  o.value !== value && disabledOptions.includes(o.value)
                }
                key={o.value}
                value={o.value}
              >
                {o.label}
              </Option>
            );
          })}
        </Select>
        {hasError && <ErrorMessage> {rawErrors.join(" , ")} </ErrorMessage>}
      </MaxWidthContainer>
    </ElementWrapper>
  );
};

const ErrorMessage = styled.label`
  color: ${red.base};
`;

const MaxWidthContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
`;

export const getPopupContainer = (triggerNode: HTMLElement) =>
  triggerNode.parentNode as HTMLElement;
