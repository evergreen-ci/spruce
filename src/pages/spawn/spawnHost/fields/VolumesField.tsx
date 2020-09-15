import React from "react";
import styled from "@emotion/styled";
import { Select } from "antd";
import { InputLabel } from "components/styles";
import { SpawnVolumeButton } from "pages/spawn/spawnVolume/SpawnVolumeButton";

const { Option } = Select;

interface VolumesFieldProps {
  onChange: React.Dispatch<React.SetStateAction<any>>;
  data: {
    volume?: string;
  };
  volumes: any[];
}

export const VolumesField: React.FC<VolumesFieldProps> = ({
  onChange,
  data,
  volumes,
}) => {
  const { volume } = data;
  return (
    <>
      <FlexColumnContainer>
        <InputLabel htmlFor="hostDetailsDatePicker">Volume</InputLabel>
        <Select
          id="volumesSelectDropown"
          showSearch
          style={{ width: 200 }}
          placeholder="Select volume"
          onChange={(v) => onChange({ ...data, volume: v })}
          value={volume}
        >
          {volumes?.map((v) => (
            <Option
              value={v.id}
              key={`volume_option_${v.id}`}
              disabled={v.hostID == null}
            >
              ({v.size}gb) {v.displayName || v.id}
            </Option>
          ))}
        </Select>
      </FlexColumnContainer>
      <PaddedBody> or </PaddedBody>
      <PaddedSpawnVolumeButton showMetadata={false} />
    </>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PaddedBody = styled.span`
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 22px;
`;

const PaddedSpawnVolumeButton = styled(SpawnVolumeButton)`
  margin-top: 22px;
`;
