import React from "react";
import { InputNumber } from "antd";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";
import { InputLabel } from "components/styles";

interface Props {
  value: number;
  onChange: (s: number) => void;
}

export const SizeSelector: React.FC<Props> = ({ value, onChange }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Volume Size</SectionLabel>
    <ModalContent>
      <InputLabel htmlFor="volumeSize">Size</InputLabel>
      <InputNumber
        data-cy="volumeSize"
        id="volumeSize"
        min={1}
        max={500}
        value={value}
        onChange={onChange}
      />
    </ModalContent>
  </SectionContainer>
);
