import { gql } from "@apollo/client";

export const SPAWN_VOLUME = gql`
  mutation SpawnVolume($SpawnVolumeInput: SpawnVolumeInput!) {
    spawnVolume(spawnVolumeInput: $SpawnVolumeInput)
  }
`;
