import { Select, Option } from "@leafygreen-ui/select";

interface Props {
  onChange: (value: string) => void;
  selectedRegion: string;
  awsRegions: string[];
}

export const RegionSelector: React.VFC<Props> = ({
  onChange,
  selectedRegion,
  awsRegions,
}) => (
  <Select
    label="Region"
    data-cy="regionSelector"
    placeholder="Select a region"
    onChange={onChange}
    value={selectedRegion}
    allowDeselect={false}
  >
    {awsRegions?.map((region) => (
      <Option value={region} key={`region_option_${region}`}>
        {region}
      </Option>
    ))}
  </Select>
);
