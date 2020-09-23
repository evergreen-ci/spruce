import { gql } from "@apollo/client";

export const SPAWN_HOST = gql`
  mutation SpawnHost($SpawnHostInput: SpawnHostInput) {
    spawnHost(spawnHostInput: $SpawnHostInput) {
      id
      status
    }
  }
`;
