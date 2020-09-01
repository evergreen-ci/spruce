import { gql } from "@apollo/client";

export const REMOVE_PUBLIC_KEY = gql`
  mutation RemovePublicKey($keyName: String!) {
    removePublicKey(keyName: $keyName) {
      key
      name
    }
  }
`;
