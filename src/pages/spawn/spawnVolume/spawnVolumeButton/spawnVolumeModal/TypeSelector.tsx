import { Select, Option } from "@leafygreen-ui/select";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";
import { InputLabel } from "components/styles";
import { volumeTypes } from "constants/volumes";

interface Props {
  value: string;
  onChange: (t: string) => void;
}

export const TypeSelector: React.VFC<Props> = ({ value, onChange }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Type</SectionLabel>
    <ModalContent>
      <InputLabel htmlFor="typeDropdown">Type</InputLabel>
      <Select
        id="typeDropdown"
        aria-labelledby="type-select"
        data-cy="typeSelector"
        style={{ width: 200 }}
        placeholder="Select a type"
        onChange={onChange}
        value={value}
      >
        {volumeTypes.map((t) => (
          <Option value={t} key={`type_option_${t}`}>
            {t}
          </Option>
        ))}
      </Select>
    </ModalContent>
  </SectionContainer>
);
