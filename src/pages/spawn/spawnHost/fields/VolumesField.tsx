import React from "react";
import styled from "@emotion/styled";
import { Select, Input } from "antd";
import { InputLabel } from "components/styles";
import { Volume } from "gql/generated/types";

const { Option } = Select;

interface VolumesFieldProps {
  onChange: React.Dispatch<React.SetStateAction<any>>;
  data: {
    volumeId?: string;
    homeVolumeSize?: number;
  };
  volumes: Volume[];
  allowHomeVolume?: boolean;
}

export const VolumesField: React.FC<VolumesFieldProps> = ({
  onChange,
  data,
  volumes,
  allowHomeVolume = false,
}) => {
  const availableVolumes = volumes.filter((v) => v.hostID === "");

  const { volumeId, homeVolumeSize } = data;
  return (
    <>
      <FlexColumnContainer>
        <InputLabel htmlFor="volumesSelectDropown">Volume</InputLabel>
        <Select
          id="volumesSelectDropown"
          showSearch
          style={{ width: 200 }}
          placeholder="Select volume"
          onChange={(v) => onChange({ ...data, volumeId: v })}
          value={volumeId}
        >
          {availableVolumes?.map((v) => (
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
      {allowHomeVolume && (
        <>
          <PaddedBody> or </PaddedBody>
          <FlexColumnContainer>
            <InputLabel htmlFor="volumeSizePicker">Volume Size</InputLabel>
            <Input
              id="volumeSizePicker"
              type="number"
              suffix="GB"
              value={homeVolumeSize}
              defaultValue={500}
              onChange={(e) =>
                onChange({ ...data, homeVolumeSize: e.target.value })
              }
            />
          </FlexColumnContainer>
        </>
      )}
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
