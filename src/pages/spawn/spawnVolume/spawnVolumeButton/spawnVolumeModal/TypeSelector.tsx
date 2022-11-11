import { Select, Option } from "@leafygreen-ui/select";
import { SectionContainer, SectionLabel } from "components/Spawn";
import { volumeTypes } from "constants/volumes";

interface Props {
  value: string;
  onChange: (t: string) => void;
}

export const TypeSelector: React.VFC<Props> = ({ value, onChange }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Type</SectionLabel>
    <Select
      label="Type"
      data-cy="typeSelector"
      style={{ width: 200 }}
      placeholder="Select a type"
      onChange={onChange}
      value={value}
      allowDeselect={false}
    >
      {volumeTypes.map((t) => (
        <Option value={t} key={`type_option_${t}`}>
          {t}
        </Option>
      ))}
    </Select>
  </SectionContainer>
);
