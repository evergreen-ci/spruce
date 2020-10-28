import { gql } from "@apollo/client";

export const UPDATE_SPAWN_VOLUME = gql`
  mutation UpdateVolume($UpdateVolumeInput: UpdateVolumeInput!) {
    updateVolume(updateVolumeInput: $UpdateVolumeInput)
  }
`;
