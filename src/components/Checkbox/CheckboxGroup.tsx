import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { TreeDataEntry } from "components/TreeSelect";

interface CheckboxesProps {
  data: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxesProps> = ({
  data,
  value,
  onChange = () => undefined,
}) => (
  <CheckboxesWrapper>
    {data.map(({ key, title, value: checkboxValue }) => (
      <Checkbox
        key={key}
        className="cy-checkbox"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, key)}
        label={title}
        checked={value.includes(checkboxValue)}
        bold={false}
        data-testid={title}
      />
    ))}
  </CheckboxesWrapper>
);

const CheckboxesWrapper = styled.div`
  padding: 4px;
`;
