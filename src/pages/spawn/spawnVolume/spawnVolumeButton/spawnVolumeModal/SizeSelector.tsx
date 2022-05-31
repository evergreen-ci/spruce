import TextInput from "@leafygreen-ui/text-input";
import { Tooltip } from "antd";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";

interface Props {
  value: number;
  limit: number;
  onChange: (s: number) => void;
}

export const SizeSelector: React.VFC<Props> = ({ value, onChange, limit }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Volume Size</SectionLabel>
    <ModalContent>
      <Tooltip title={`Max Spawnable Volume Size is ${limit} GiB`}>
        <TextInput
          label="Size (GB)"
          data-cy="volumeSize"
          id="volumeSize"
          min={0}
          max={limit}
          value={value.toString()}
          type="number"
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
      </Tooltip>
    </ModalContent>
  </SectionContainer>
);
