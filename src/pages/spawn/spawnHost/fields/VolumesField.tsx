import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { Select } from "antd";
import { InputLabel } from "components/styles";
import { size } from "constants/tokens";
import { MyVolume } from "types/spawn";

const { Option } = Select;

export type VolumesData = {
  volumeId?: string;
  homeVolumeSize?: number; // homeVolumeSize is only useful for creating a new host but the consuming component is used for both modals (create & edit)
};
interface VolumesFieldProps {
  onChange: (data: VolumesData) => void;
  data: {
    volumeId?: string;
    homeVolumeSize?: number;
  };
  volumes: MyVolume[];
  allowHomeVolume?: boolean;
}

export const VolumesField: React.VFC<VolumesFieldProps> = ({
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
          data-cy="volume-select"
          style={{ width: 200 }}
          placeholder="Select volume"
          onChange={(v) => onChange({ volumeId: v })}
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
          <TextInput
            label="Volume Size (GB)"
            id="volumeSizePicker"
            min={0}
            value={homeVolumeSize?.toString() || "500"}
            onChange={(e) =>
              onChange({
                homeVolumeSize: parseInt(e.target.value, 10),
              })
            }
            type="number"
          />
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
  padding-left: ${size.s};
  padding-right: ${size.s};
  margin-top: ${size.m};
`;
