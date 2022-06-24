import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Select } from "antd";
import { InputLabel } from "components/styles";
import { OneOf } from "types/utils";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps } from "./types";

const { Option } = Select;
const { red } = uiColors;

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
  placeholder,
  readonly,
  value,
  onChange,
  rawErrors,
}) => {
  const {
    disabledEnums,
    hideError,
    ariaLabelledBy,
    enumOptions,
    "data-cy": dataCy,
    marginBottom,
  } = options;

  const hasError = !hideError && !!rawErrors?.length && !disabled;
  const isDisabled = disabled || readonly;
  const disabledOptions = disabledEnums ?? [];

  const labelProps: OneOf<
    { label: string },
    { "aria-labelledby": string }
  > = ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : { label };

  return (
    <ElementWrapper marginBottom={marginBottom}>
      <MaxWidthContainer>
        <InputLabel htmlFor={dataCy}>{label}</InputLabel>
        <Select
          disabled={isDisabled}
          value={value}
          onChange={(v) => onChange(v === "" ? null : v)}
          placeholder={placeholder}
          id={dataCy}
          data-cy={dataCy}
          status={hasError ? "error" : ""}
          {...labelProps}
        >
          {enumOptions.map((o) => {
            // Handle deselect value without errors
            if (o.value === null) {
              return;
            }
            return (
              <Option
                key={o.value}
                value={o.value}
                disabled={
                  o.value !== value && disabledOptions.includes(o.value)
                }
              >
                {o.label}
              </Option>
            );
          })}
        </Select>
        {hasError && <ErrorMessage>Selection is required.</ErrorMessage>}
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
