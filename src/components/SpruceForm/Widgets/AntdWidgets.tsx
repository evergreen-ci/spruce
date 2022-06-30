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
  onChange,
  placeholder,
  rawErrors,
  readonly,
  value,
}) => {
  const {
    ariaLabelledBy,
    "data-cy": dataCy,
    disabledEnums,
    hideError,
    enumOptions,
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
        {hasError && <ErrorMessage> Selection is required. </ErrorMessage>}
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
