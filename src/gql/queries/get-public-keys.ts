import { gql } from "@apollo/client";

export const GET_MY_PUBLIC_KEYS = gql`
  query GetMyPublicKeys {
    myPublicKeys {
      name
      key
    }
  }
`;
