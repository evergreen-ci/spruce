import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { TreeDataEntry } from "components/TreeSelect";
import { size } from "constants/tokens";

interface CheckboxesProps {
  data: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxesProps> = ({
  data,
  onChange = () => undefined,
  value,
}) => (
  <CheckboxesWrapper>
    {data.map(({ key, title, value: checkboxValue }) => (
      <StyledCheckbox
        key={key}
        className="cy-checkbox"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, key)}
        label={title}
        checked={value.includes(checkboxValue)}
        bold={false}
        data-cy={title}
      />
    ))}
  </CheckboxesWrapper>
);

const CheckboxesWrapper = styled.div`
  padding: ${size.xxs};
`;

/* @ts-expect-error */
const StyledCheckbox = styled(Checkbox)`
  margin-bottom: ${size.xs};

  :last-of-type {
    margin-bottom: 0;
  }
`;
