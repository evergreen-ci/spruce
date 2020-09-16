import { gql } from "@apollo/client";

export const GET_SPRUCE_CONFIG = gql`
  query GetSpruceConfig {
    spruceConfig {
      siteBanner {
        text
        theme
      }
      userVoiceUrl
    }
  }
`;
