import { gql } from "@apollo/client";

export const DETACH_VOLUME = gql`
  mutation DetachVolumeFromHost($volumeId: String!) {
    detachVolumeFromHost(volumeId: $volumeId)
  }
`;
