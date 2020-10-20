import React from "react";
import { Select } from "antd";
import { InputLabel } from "components/styles";
import { ModalContent } from "./Layout";

const { Option } = Select;

interface Props {
  onChange: (value: string) => void;
  selectedRegion: string;
  awsRegions: string[];
}

export const RegionSelector: React.FC<Props> = ({
  onChange,
  selectedRegion,
  awsRegions,
}) => (
  <ModalContent>
    <InputLabel htmlFor="awsSelectDropown">Region</InputLabel>
    <Select
      id="awsSelectDropown"
      showSearch
      style={{ width: 200 }}
      placeholder="Select a region"
      onChange={onChange}
      value={selectedRegion}
    >
      {awsRegions?.map((region) => (
        <Option value={region} key={`region_option_${region}`}>
          {region}
        </Option>
      ))}
    </Select>
  </ModalContent>
);
