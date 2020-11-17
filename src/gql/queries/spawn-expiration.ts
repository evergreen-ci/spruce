import { gql } from "@apollo/client";

export const GET_SPAWN_EXPIRATION_INFO = gql`
  query SpawnExpirationInfo {
    myHosts {
      noExpiration
      id
    }
    myVolumes {
      noExpiration
      id
    }
    spruceConfig {
      spawnHost {
        unexpirableHostsPerUser
        unexpirableVolumesPerUser
      }
    }
  }
`;
