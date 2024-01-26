import styled from "@emotion/styled";
import { Error, Label } from "@leafygreen-ui/typography";
import Dropdown from "components/Dropdown";
import { TreeSelect, ALL_VALUE } from "components/TreeSelect";
import { size } from "constants/tokens";
import ElementWrapper from "../ElementWrapper";
import { EnumSpruceWidgetProps } from "./types";

export const MultiSelect: React.FC<EnumSpruceWidgetProps> = ({
  disabled,
  label,
  onChange,
  options,
  rawErrors,
  value,
}) => {
  const { "data-cy": dataCy, elementWrapperCSS, enumOptions } = options;

  const dropdownOptions = [
    {
      title: "All",
      key: ALL_VALUE,
      value: ALL_VALUE,
    },
    ...enumOptions.map((o) => ({
      title: o.label,
      key: o.value,
      value: o.value,
    })),
  ];

  const handleChange = (selected: string[]) => {
    // Filter out the "all" value since it isn't a valid enum.
    onChange(selected.filter((s) => s !== ALL_VALUE));
  };

  const includeAll = value.length === enumOptions.length;
  const selectedOptions = [...value, ...(includeAll ? [ALL_VALUE] : [])];

  return (
    <ElementWrapper limitMaxWidth css={elementWrapperCSS}>
      <Container>
        <Label htmlFor={`${label}-multiselect`}>{label}</Label>
        <Dropdown
          disabled={disabled}
          id={`${label}-multiselect`}
          data-cy={dataCy}
          buttonText={`${label}: ${
            value.length ? value.join(", ") : "No options selected."
          }`}
        >
          <TreeSelect
            onChange={handleChange}
            tData={dropdownOptions}
            state={selectedOptions}
            hasStyling={false}
          />
        </Dropdown>
        {rawErrors?.length > 0 && <Error>{rawErrors?.join(", ")}</Error>}
      </Container>
    </ElementWrapper>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xxs};
`;

export default MultiSelect;
