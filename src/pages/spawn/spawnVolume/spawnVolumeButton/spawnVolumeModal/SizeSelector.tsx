import TextInput from "@leafygreen-ui/text-input";
import { Description } from "@leafygreen-ui/typography";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";

interface Props {
  value: number;
  limit: number;
  onChange: (s: number) => void;
}

export const SizeSelector: React.VFC<Props> = ({ value, onChange, limit }) => (
  <SectionContainer>
    <div>
      <SectionLabel weight="medium">Volume Size</SectionLabel>
      <Description>The max volume size is {limit} GiB.</Description>
    </div>
    <ModalContent style={{ width: 200 }}>
      <TextInput
        label="Size (GB)"
        data-cy="volumeSize"
        id="volumeSize"
        min={0}
        max={limit}
        style={{ width: 200 }}
        value={value.toString()}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        type="number"
      />
    </ModalContent>
  </SectionContainer>
);
