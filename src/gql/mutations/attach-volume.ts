import { gql } from "@apollo/client";

export const ATTACH_VOLUME = gql`
  mutation AttachVolumeToHost($volumeAndHost: VolumeHost!) {
    attachVolumeToHost(volumeAndHost: $volumeAndHost)
  }
`;
