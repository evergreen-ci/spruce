import React from "react";
import { useQuery } from "@apollo/client";
import {
  RegionSelector,
  SectionContainer,
  SectionLabel,
} from "components/Spawn";
import { useBannerDispatchContext } from "context/banners";
import {
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
} from "gql/generated/types";
import { GET_SUBNET_AVAILABILITY_ZONES } from "gql/queries";

interface Props {
  onChange: (value: string) => void;
  value: string;
}

export const AvailabilityZoneSelector: React.FC<Props> = ({
  onChange,
  value,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const { data } = useQuery<
    SubnetAvailabilityZonesQuery,
    SubnetAvailabilityZonesQueryVariables
  >(GET_SUBNET_AVAILABILITY_ZONES, {
    onError: (e) => {
      dispatchBanner.errorBanner(
        `Unable to fetch subnet availability zones: ${e}`
      );
    },
  });

  const zones = data?.subnetAvailabilityZones;

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
