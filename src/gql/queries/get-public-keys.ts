import gql from "graphql-tag";

export const GET_MY_PUBLIC_KEYS = gql`
  query GetMyPublicKeys {
    myPublicKeys {
      name
      key
    }
  }
`;
