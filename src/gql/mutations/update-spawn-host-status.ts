import { gql } from "@apollo/client";

export const UPDATE_SPAWN_HOST_STATUS = gql`
  mutation UpdateSpawnHostStatus(
    $hostId: String!
    $action: SpawnHostStatusActions!
  ) {
    updateSpawnHostStatus(hostId: $hostId, action: $action) {
      id
      status
    }
  }
`;
