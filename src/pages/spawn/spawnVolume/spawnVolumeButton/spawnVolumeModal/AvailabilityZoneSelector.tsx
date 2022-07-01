import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  RegionSelector,
  SectionContainer,
  SectionLabel,
} from "components/Spawn";
import { useToastContext } from "context/toast";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
} from "gql/generated/types";
import { GET_SUBNET_AVAILABILITY_ZONES } from "gql/queries";

interface Props {
  onChange: (value: string) => void;
  value: string;
}

export const AvailabilityZoneSelector: React.VFC<Props> = ({
  onChange,
  value,
}) => {
  const dispatchToast = useToastContext();
  const { data } = useQuery<
    SubnetAvailabilityZonesQuery,
    SubnetAvailabilityZonesQueryVariables
  >(GET_SUBNET_AVAILABILITY_ZONES, {
    onError: (e) => {
      dispatchToast.error(`Unable to fetch subnet availability zones: ${e}`);
    },
  });

  const zones = data?.subnetAvailabilityZones;

  useEffect(() => {
    if (zones) {
      onChange(zones[0]);
    }
  }, [zones]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <SectionContainer>
      <SectionLabel weight="medium">Availability Zone</SectionLabel>
      <RegionSelector
        onChange={onChange}
        selectedRegion={value}
        awsRegions={zones}
      />
    </SectionContainer>
  );
};
