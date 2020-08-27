import { gql } from "@apollo/client";

export const GET_USER_CONFIG = gql`
  query GetUserConfig {
    userConfig {
      api_key
      api_server_host
      ui_server_host
      user
    }
  }
`;
