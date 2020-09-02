import { gql } from "@apollo/client";

export const GET_MY_VOLUMES = gql`
  query myVolumes {
    myVolumes {
      id
      displayName
      createdBy
      type
      availabilityZone
      size
      expiration
      deviceName
      hostID
      noExpiration
      homeVolume
    }
  }
`;
