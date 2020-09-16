import { gql } from "@apollo/client";

export const DETACH_VOLUME = gql`
  mutation DetachVolume($volumeId: String!) {
    detachVolumeFromHost(volumeId: $volumeId)
  }
`;
