import { gql } from "@apollo/client";

export const GET_SPRUCE_CONFIG = gql`
  query GetSpruceConfig {
    spruceConfig {
      bannerTheme
      banner
      ui {
        userVoice
      }
      jira {
        host
      }
      providers {
        aws {
          maxVolumeSizePerUser
        }
      }
      spawnHost {
        spawnHostsPerUser
        unexpirableHostsPerUser
        unexpirableVolumesPerUser
      }
    }
  }
`;
