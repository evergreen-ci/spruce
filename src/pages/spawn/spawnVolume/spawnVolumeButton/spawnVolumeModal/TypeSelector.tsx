import React from "react";
import { Select } from "antd";
import { ModalContent, SectionContainer, SectionLabel } from "components/Spawn";
import { InputLabel } from "components/styles";

const { Option } = Select;

interface Props {
  value: string;
  onChange: (t: string) => void;
}

export const TypeSelector: React.FC<Props> = ({ value, onChange }) => (
  <SectionContainer>
    <SectionLabel weight="medium">Type</SectionLabel>
    <ModalContent>
      <InputLabel htmlFor="typeDropdown">Type</InputLabel>
      <Select
        id="typeDropdown"
        style={{ width: 200 }}
        placeholder="Select a type"
        onChange={onChange}
        value={value}
        data-cy="typeSelector"
      >
        {types.map((t) => (
          <Option value={t} key={`type_option_${t}`}>
            {t}
          </Option>
        ))}
      </Select>
    </ModalContent>
  </SectionContainer>
);

const types = ["gp2", "io1", "sc1", "st1", "standard"];
