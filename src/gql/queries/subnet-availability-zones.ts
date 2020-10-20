import { gql } from "@apollo/client";

export const GET_SUBNET_AVAILABILITY_ZONES = gql`
  query subnetAvailabilityZones {
    subnetAvailabilityZones
  }
`;
