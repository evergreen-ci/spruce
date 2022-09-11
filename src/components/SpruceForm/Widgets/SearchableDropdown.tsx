import styled from "@emotion/styled";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps } from "./types";
import SearchableDropdown, {
  SearchableDropdownOption,
  SearchableDropdownProps,
} from "components/SearchableDropdown";

interface FormSearchableDropdownProps {
  options: SearchableDropdownProps<string>;
}
export const SearchableDropdownWidget: React.VFC<
  EnumSpruceWidgetProps & FormSearchableDropdownProps
> = ({ options, value, label, onChange }) => {
  const {
    ariaLabelledBy,
    "data-cy": dataCy,
    enumOptions,
    marginBottom,
    elementWrapperCSS,
    valuePlaceholder,
  } = options;
  return (
    <StyledElementWrapper css={elementWrapperCSS} marginBottom={marginBottom}>
      <SearchableDropdown
        valuePlaceholder={valuePlaceholder}
        label={ariaLabelledBy ? undefined : label}
        value={value?.value || ""}
        data-cy={dataCy}
        onChange={(v) => {
          onChange(v === "" ? null : v);
        }}
        options={enumOptions}
        searchFunc={(options, match) =>
          options.filter((o) =>
            o.value.toLowerCase().includes(match.toLowerCase())
          )
        }
        optionRenderer={(option, onClick, isChecked) => (
          <SearchableDropdownOption
            key={`searchable_dropdown_option_${option.value}`}
            value={option.value}
            displayName={option.value}
            onClick={() => onClick(option)}
            isChecked={option.value === value?.value}
          />
        )}
      />
    </StyledElementWrapper>
  );
};

const StyledElementWrapper = styled(ElementWrapper)`
  display: flex;
  flex-direction: column;
`;
