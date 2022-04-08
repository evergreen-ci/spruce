import React from "react";
import { InputNumber, Tooltip } from "antd";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";
import { InputLabel } from "components/styles";

interface Props {
  value: number;
  limit: number;
  onChange: (s: number) => void;
}

export const SizeSelector: React.VFC<Props> = ({ value, onChange, limit }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Volume Size</SectionLabel>
    <ModalContent>
      <InputLabel htmlFor="volumeSize">Size</InputLabel>
      <Tooltip title={`Max Spawnable Volume Size is ${limit} GiB`}>
        <InputNumber
          data-cy="volumeSize"
          id="volumeSize"
          min={0}
          max={limit}
          value={value}
          onChange={onChange}
        />
      </Tooltip>
    </ModalContent>
  </SectionContainer>
);
