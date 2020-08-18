import gql from "graphql-tag";

export const REMOVE_PUBLIC_KEY = gql`
  mutation RemovePublicKey($keyName: String!) {
    removePublicKey(keyName: $keyName) {
      key
      name
    }
  }
`;
