import { gql } from "@apollo/client";

export const GET_CLIENT_CONFIG = gql`
  query ClientConfig {
    clientConfig {
      clientBinaries {
        os
        displayName
        url
        arch
      }
      latestRevision
    }
  }
`;
